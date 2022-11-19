# Busylight Toggle gnome-shell-extension

This is a small extension to allow control of [busylight][1]-enabled lights from Gnome Shell.

Much of the code was gleaned from the [Tailscale Status extension][2]

# Dependencies

This requires the busylight module to be installed. You can find the installation instructions [here][1]

# Installation

Download the busylighttoggle@thomasmoyer.org directory and move it to ~/.local/share/gnome-shell/extensions/. Enable the extension in Extensions or Extension Manager. You might have to log in and out for the extension to be loaded.

# Enhancements

* Add custom colors
* Configuration panel
* Integrate more busylight commands
* Commands/instructions to install busylight
* Test on other versions of Gnome Shell (only tested on Gnome 43)

# Nested Wayland Session for development

```
env GNOME_SHELL_SLOWDOWN_FACTOR=2 \ 
    MUTTER_DEBUG_DUMMY_MODE_SPECS=1024x768 \
    dbus-run-session -- gnome-shell --nested \
                                    --wayland
```

# References
[1]: https://github.com/JnyJny/busylight
[2]: https://github.com/maxgallup/tailscale-status