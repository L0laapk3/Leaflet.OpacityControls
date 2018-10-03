Leaflet.OpacityControls
=======================

![Example Sliders](https://user-images.githubusercontent.com/6313423/46383475-d54df580-c6b0-11e8-9e7d-a3cefe3fdac7.png)


Vastly rewritten version by L0laapk3.

Simple Leaflet controls to adjust the opacity of a map.

Check out the (old) demo here: http://lizardtechblog.github.io/Leaflet.OpacityControls/

There are three controls that you can add to a map: a control to increase opacity, a control to decrease opacity, and an interactive slider control. The main files for the controls are ````lib/opacity/Control.Opacity.js```` and ````lib/opacity/Control.Opacity.css````. Only the slider control uses the jquery-ui library.

To initialize the controls, add the following lines to your javascript code:

    var opacitySlider = new L.Control.opacitySlider(*options*);
    map.addControl(opacitySlider);
    
The following options are allowed:
    
	position: 'topright' (default), 'bottomright', 'topleft', 'bottomleft': The position of the slider.
    orientation: 'vertical' (default), 'horizontal': The orientiation of the slider.
    step: int, undefined (default): With this, you can make the slider bar force certain steps.
    initial: int, 0 (default): The inital value of the slider bar.
    onChange: function(newValue), undefined (default): If provided, will call the function with the new slider value.
    evenSpacing: true (default for vertical), false (default for horizontal): Space the labels evenly? Or smart spacing?
    backdrop: "min" (default), "max", false: Defines if/where the dark colored area in the slider should appear.
    gravitate: int, 0 (default): The default gravity value (in pixels) for labels on the slider. This makes it easier for the user to only select a single layer and save on bandwidth.
    length: int, 135 (default): The length of the slider.
    labels: Array of labels to display on the slider. Each entry in the array must be an object containing the position and name keys (empty strings are allowed), and can optionally have the labels key, containing an array of leaflet layer objects. For the slider to be functional, at least 2 array objects must have a valid labels key.
   