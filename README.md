Leaflet.OpacityControls
=======================

![Example Sliders](https://user-images.githubusercontent.com/6313423/46383475-d54df580-c6b0-11e8-9e7d-a3cefe3fdac7.png)


Vastly rewritten version by L0laapk3.

Simple Leaflet controls to adjust the opacity of a map.

Check out the new demo here: https://factoriomaps.com/beta/user/L0laapk3/megabase/index.html

There are three controls that you can add to a map: a control to increase opacity, a control to decrease opacity, and an interactive slider control. The main files for the controls are `lib/opacity/Control.Opacity.js` and `lib/opacity/Control.Opacity.css`. Only the slider control uses the jquery-ui library.

To initialize the controls, add the following lines to your javascript code:

```javascript
var opacitySlider = new L.Control.opacitySlider(options);
map.addControl(opacitySlider);
```
    
The following options are allowed:
    
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Possible Values (*Default value) | Description |
| --- | --- | --- |
| `position` | `"topright"`*, `"bottomright"`, `"topleft"`, `"bottomleft"` | The position of the slider. |
| `orientation` | `"vertical"`*, `"horizontal"` | The orientiation of the slider. |
| `step` | `int`, `undefined`* | With this, you can make the slider bar force certain steps. |
| `initial` | `int`, `0`* | The inital value of the slider bar. |
`onChange` | `function(newValue, localValue, below, above)`, `undefined`* | If provided, will call the function with the new slider value (0-1), local position between nearest two labels that have attached layers, the lower bounding label with a layers (readonly), and the upper bounding label with layers (readonly). If the slider lands exactly ontop of a label with a layer, above will be `undefined`. |
| `evenSpacing` | `true`\* for vertical, `false`\* for horizontal | Space the labels evenly? Or smart spacing? |
| `backdrop` | `"min"`*, `"max"`, `false` | Defines if/where the dark colored area in the slider should appear. |
`gravitate` | `int`, `0`* | The default gravity value (in pixels) for labels on the slider. This makes it easier for the user to only select a single layer and save on | bandwidth. |
| `length` | `int`, `135`* | The length of the slider (in pixels). This can later be changed using `setLength(newLength)` |
| `labels` | `Array` | Labels to display on the slider. Each entry in the array must be an object containing the `position` and `name` keys (empty strings are allowed), and can optionally have the `layers` key, containing an array of leaflet layer objects. |

For the slider to be functional, at least 2 array objects must have a valid labels key.


This mod also adds radio boxes to switch between layers that are compatible with the opacity sliders:

```javascript
var layerRadioSelector = new L.Control.layerRadioSelector(options);
map.addControl(layerRadioSelector);
```
    
The following options are allowed:
    
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Possible Values (*Default value) | Description |
| --- | --- | --- |
| `position` | `"topright"`*, `"bottomright"`, `"topleft"`, `"bottomleft"` | The position of the radio selector. |
| `initial` | `int`, `0`* | The inital value of the radio selector. |
`onChange` | `function(newValue)`, `undefined`* | If provided, will call the function with the new radio selection index. |
| `labels` | `Array` | Labels to choose from in the radio selection list. Each entry in the array must be an object containing the `name` keys (empty strings are allowed), and the `layers` key, containing an array of leaflet layer objects (Can be empty). |