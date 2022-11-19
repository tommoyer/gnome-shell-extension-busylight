/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const { GObject, St } = imports.gi;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();

const status_off_string = "⚪ Busylight Off";
const status_on_green_string = "🟢 Busylight On (Green)";
const status_on_red_string = "🔴 Busylight On (Red)";

let icon;
let icon_off;
let icon_on_green;
let icon_on_red;
let menu_off;
let menu_on_green;
let menu_on_red;

function cmdBusylight(args) {
    try {
        let proc = Gio.Subprocess.new(
            ["busylight"].concat(args),
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );
        proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
                proc.communicate_utf8_finish(res);
                if (!proc.get_successful()) {
                    log(args);
                    log("failed @ cmdBusylight");
                }
            } catch (e) {
                logError(e);
            }
        });
    } catch (e) {
        logError(e);
    }
}

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Busylight Toggle');

        icon_on_green = Gio.icon_new_for_string( Me.dir.get_path() + '/icon-on-green.svg' );
        icon_on_red = Gio.icon_new_for_string( Me.dir.get_path() + '/icon-on-red.svg' );
        icon_off = Gio.icon_new_for_string( Me.dir.get_path() + '/icon-off.svg' );        

        icon = new St.Icon({
            gicon: icon_off,
            style_class: 'system-status-icon',
        });

        this.add_child(icon);
        
        menu_off = new PopupMenu.PopupMenuItem(status_off_string);
        menu_off.connect('activate', () => {
            //Main.notify('Turning off');
            cmdBusylight(["off"]);
            icon.gicon = icon_off;
        });
        this.menu.addMenuItem(menu_off);

        menu_on_green = new PopupMenu.PopupMenuItem(status_on_green_string);
        menu_on_green.connect('activate', () => {
            //Main.notify('Turning on (Green)');
            cmdBusylight(["on", "green"]);
            icon.gicon = icon_on_green;
        });
        this.menu.addMenuItem(menu_on_green);

        menu_on_red = new PopupMenu.PopupMenuItem(status_on_red_string);
        menu_on_red.connect('activate', () => {
            //Main.notify('Turning on (Red)');
            cmdBusylight(["on", "red"]);
            icon.gicon = icon_on_red;
        });
        this.menu.addMenuItem(menu_on_red);

    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
        icon_off = null;
        icon_on_red = null;
        icon_on_green = null;
        icon = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
