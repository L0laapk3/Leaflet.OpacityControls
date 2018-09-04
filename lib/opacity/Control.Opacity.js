/*
        Leaflet.OpacityControls, a plugin for adjusting the opacity of a Leaflet map.
        (c) 2013, Jared Dominguez
        (c) 2013, LizardTech

        https://github.com/lizardtechblog/Leaflet.OpacityControls
*/



//Create a jquery-ui slider with values from 0 to 100. Match the opacity value to the slider value divided by 100.
L.Control.opacitySlider = L.Control.extend({
    options: {
        position: 'topright',
        sliderOrientation: 'vertical',
        step: undefined,
        initial: 0,
        onChange: undefined,
        opacityLayer: undefined,
        backgroundLayer: undefined,
        gravitate: 0,
        length: 135,
        labels: undefined //example: [ {name: "Day", position: 0}, {name: "Nightvision", position: 50, gravitate: 2}, {name: "Night", position: 100} ]
    },
    onAdd: function (map) {
        var _this = this;
        if (!this.options.opacityLayer)
            new Error("define an opacity layer");

        this.options._opacitySliderDiv = L.DomUtil.create('div', 'opacity-slider-control');
        this.options._opacitySliderDiv.style[this.options.sliderOrientation == "horizontal" ? "width" : "height"] = this.options.length + "px"
        
        $(this.options._opacitySliderDiv).slider({
          orientation: this.options.sliderOrientation,
          range: "min",
          min: 0,
          max: 100,
          value: this.options.initial,
          step: this.options.step,
          start: function ( event, ui) {
            //When moving the slider, disable panning.
            map.dragging.disable();
            map.once('mousedown', function (e) { 
              map.dragging.enable();
            });
          },
          slide: (event, ui) => {return update(event.originalEvent.target.dataset.position || ui.value, _this.options)}
        });

        var markers = $("<div class='ui-slider-markers'>");
        this.options.labels.forEach(label => markers.append("<div class='ui-slider-marker' style='left: " + label.position + "%;top: " + label.position + "%;' data-position=" + label.position + "><div class='ui-slider-marker-text' data-position=" + label.position + " style='transform:" + (this.options.sliderOrientation == "horizontal" ? "translateX" : "translateY") + "(calc(" + (-label.position + "% + " + (label.position % 100 == 0 ? (label.position * .022 - 1.1) : "0")) + "em))'>" + label.name));
        $(this.options._opacitySliderDiv).prepend(markers);

        update(this.options.initial, this.options);

        return $("<div class='opacity-slider-container " + this.options.sliderOrientation.toLowerCase() + "'>").append(this.options._opacitySliderDiv)[0];


        function update(value, options) {
                       options.labels.forEach(label => label._d = Math.abs(label.position - value));
            var snap = options.labels.filter(label => label._d <= (label.gravitate || options.gravitate))
                                     .sort((a, b) => Math.abs(a.position - value) - Math.abs(b.position - value))[0];
                                     
            var slider_value = (snap ? snap.position : value) / 100;
            if (slider_value < 0.01 && map.hasLayer(options.opacityLayer))  map.removeLayer(options.opacityLayer);
            if (slider_value > 0.01 && !map.hasLayer(options.opacityLayer))  map.addLayer(options.opacityLayer);
            if (options.backgroundLayer) {
                if (slider_value > 0.99 && map.hasLayer(options.backgroundLayer))  map.removeLayer(options.backgroundLayer);
                if (slider_value < 0.99 && !map.hasLayer(options.backgroundLayer))  { map.addLayer(options.backgroundLayer); options.opacityLayer.bringToFront(); }
            }

            options.opacityLayer.setOpacity(slider_value);
            if (snap)
                $(options._opacitySliderDiv).slider("value", snap.position);

            if (options.onChange)
                options.onChange(value)
                
            if (snap)
                return false;
        }
    }
});
