# Create Unity Prompt

## Role

Act as a Senior Unity Engineer implementing a Unity system in Project Genesis.

## Before Implementation

1. Review [`.cursor/rules/08-unity-development.mdc`](../rules/08-unity-development.mdc).
2. Check [standards/unity/](../../standards/unity/) and [knowledge/unity/](../../knowledge/unity/).
3. Define system responsibility, component structure, and data flow.
4. Consider mobile performance: memory, FPS, battery.

## During Implementation

Follow:

- Component-based design
- Scriptable Objects for data configuration
- Minimal Update loops
- Addressables for asset management

## Required Output

- Component architecture
- Scriptable Object definitions (if applicable)
- Implementation with clear lifecycle
- Performance considerations documented

## Checklist

- [ ] No large MonoBehaviours
- [ ] No tight coupling between systems
- [ ] Mobile performance considered
- [ ] Prefab and scene organization documented

## Related

- Composable template: [prompts/templates/create-unity.md](../../prompts/templates/create-unity.md)
