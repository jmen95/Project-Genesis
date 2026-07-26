import { ComponentOrderingError } from '../domain/component-ordering.errors.js';
import type {
  ProjectTemplateManifest,
  TemplateFileEntry,
} from '../domain/template-provider.interface.js';

export class ComponentOrdering {
  orderFiles(
    manifest: ProjectTemplateManifest,
    files: readonly TemplateFileEntry[],
  ): TemplateFileEntry[] {
    if (!manifest.components || Object.keys(manifest.components).length === 0) {
      return [...files];
    }

    const componentIds = Object.keys(manifest.components);
    const uniqueIds = new Set(componentIds);
    if (uniqueIds.size !== componentIds.length) {
      throw new ComponentOrderingError('COMP-003', 'Duplicate component id in manifest');
    }

    const graph = new Map<string, readonly string[]>();
    for (const [id, component] of Object.entries(manifest.components)) {
      for (const dependency of component.dependsOn ?? []) {
        if (!uniqueIds.has(dependency)) {
          throw new ComponentOrderingError(
            'COMP-001',
            `Component "${id}" depends on missing component "${dependency}"`,
          );
        }
      }
      graph.set(id, [...(component.dependsOn ?? [])].sort());
    }

    const sortedComponentIds = this.topologicalSort(componentIds, graph);

    const fileByRelativePath = new Map(files.map((file) => [file.relativePath, file]));
    const orderedPaths: string[] = [];
    const seenPaths = new Set<string>();

    for (const componentId of sortedComponentIds) {
      const componentFiles = [...(manifest.components[componentId]?.files ?? [])].sort();
      for (const relativePath of componentFiles) {
        if (!seenPaths.has(relativePath)) {
          orderedPaths.push(relativePath);
          seenPaths.add(relativePath);
        }
      }
    }

    const remaining = [...files]
      .map((file) => file.relativePath)
      .filter((path) => !seenPaths.has(path))
      .sort();

    for (const relativePath of remaining) {
      orderedPaths.push(relativePath);
      seenPaths.add(relativePath);
    }

    return orderedPaths
      .map((relativePath) => fileByRelativePath.get(relativePath))
      .filter((file): file is TemplateFileEntry => file !== undefined);
  }

  private topologicalSort(
    componentIds: readonly string[],
    graph: Map<string, readonly string[]>,
  ): string[] {
    const ids = [...componentIds].sort();
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    for (const id of ids) {
      inDegree.set(id, 0);
      adjacency.set(id, []);
    }

    for (const [node, dependencies] of graph.entries()) {
      for (const dependency of dependencies) {
        adjacency.get(dependency)?.push(node);
        inDegree.set(node, (inDegree.get(node) ?? 0) + 1);
      }
    }

    const queue = ids.filter((id) => (inDegree.get(id) ?? 0) === 0).sort();
    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) {
        break;
      }
      result.push(current);

      const neighbors = [...(adjacency.get(current) ?? [])].sort();
      for (const neighbor of neighbors) {
        const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
        inDegree.set(neighbor, nextDegree);
        if (nextDegree === 0) {
          queue.push(neighbor);
          queue.sort();
        }
      }
    }

    if (result.length !== ids.length) {
      throw new ComponentOrderingError('COMP-002', 'Circular component dependency detected');
    }

    return result;
  }
}
