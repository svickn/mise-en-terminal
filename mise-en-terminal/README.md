# Mise En Terminal: Open multiple terminals and run commands by configuration in VS Code

## Example `.metrc.json` File

```
{
  "terminals": [
    {
      "name": "server",
      "path": "server",
      "commands": [
        "ECHO server"
      ]
    },
    {
      "name": "ui",
      "path": "ui",
      "commands": [
        "ECHO ui"
      ]
    },
    {
      "name": "extra",
      "path": "",
      "commands": []
    }
  ]
}
```
