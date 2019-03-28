/*
        Leaflet.OpacityControls, a plugin for adjusting the opacity of a Leaflet map.
        (c) 2013, Jared Dominguez
        (c) 2013, LizardTech

        https://github.com/lizardtechblog/Leaflet.OpacityControls
*/



//Create a jquery-ui slider with values from 0 to 100. Match the opacity value to the slider value divided by 100.
let t1, t2, globalID = 0;
L.Control.opacitySlider = L.Control.extend({
    options: {
        position: 'topright',
        orientation: 'vertical',
        step: undefined,
        initial: 0,
        onChange: undefined,
        evenSpacing: undefined,
        backdrop: "min",
        gravitate: 0,
        length: 135,
        labels: undefined //example: [ {name: "Day", position: 0, layers: [..]}, {name: "Nightvision", position: 0.5, gravitate: 2}, {name: "Night", position: 1, layers: [..]} ]
    },
    onAdd: function (map) {
        if (!this.options.opacityLayer)
            new Error("define an opacity layer");

        if (!map._addLayer) {
            map._addLayer = map.addLayer;
            map.addLayer = function(layer) {
                map._addLayer.call(this, layer);
                if (layer._zcontainer)
                    $(layer._zcontainer).append(layer._container);
            }
        }

        let _this = this, container;
        this.ID = globalID++;

        if (this.options.evenSpacing === undefined)
            this.options.evenSpacing = this.options.orientation == "vertical";

        this.options.labels.sort((a, b) => b.position - a.position);

        this.options.labels.forEach(l => {
            if (l.layers && !l.layers.length)
                l.layers = undefined
        });

        this.options._opacitySliderDiv = L.DomUtil.create('div', 'opacity-slider-control');
        this.options._opacitySliderDiv.style[this.options.orientation == "horizontal" ? "width" : "height"] = this.options.length + "px"
        
        this.max = this.options.length;
        let slider = $(this.options._opacitySliderDiv).slider({
          orientation: this.options.orientation,
          range: this.options.backdrop,
          value: this.options.initial * this.options.length,
          step: this.options.step,
          min: 0,
          max: this.max,
          animate: 250,
          start: function (event, ui) {
            //When moving the slider, disable panning.
            map.dragging.disable();
            map.once('mousedown', function (e) { 
              map.dragging.enable();
            });
          },
          slide: (event, ui) => update(parseFloat(event.originalEvent.target.dataset.position || (ui.value / _this.max)))
        });

        this.setLength = function(newLength) {
            _this.max = newLength;
            slider.slider("option", "max", newLength);
            slider.slider("option", "value", slider.slider("option", "value") / _this.options.length * newLength);
            _this.options.length = newLength;
            _this.options._opacitySliderDiv.style[this.options.orientation == "horizontal" ? "width" : "height"] = newLength + "px";

        }

        let topContainer = $("#map .leaflet-tile-pane:first")[0];
        this.layers = [];
        this.options.labels.filter(l => l.layers).forEach((label, i, arr) => {
            label.containers = [];
            label.layers.forEach(layer => {
                
                let container = label.containers.find(c => c.parentNode.isSameNode(layer._zcontainer || topContainer));
                if (!container) {
                    let $cont = $("<div style = 'z-index: " + (arr.length - i) + "; opacity: 0' class='leaflet-opacity-stack'>");
                    $cont.appendTo(layer._zcontainer || topContainer);
                    container = $cont[0];
                    label.containers.push(container);
                }
                layer._zcontainer = container;

                if (!layer._opacities)
                    layer._opacities = {};
                layer._opacities[this.ID] = 0;
                this.layers.push(layer);
            });
        });

        let markers = $("<div class='ui-slider-markers'>");
        this.options.labels.forEach(label => markers.append("<div class='ui-slider-marker' style='left: " + label.position*100 + "%;bottom: " + label.position*100 + "%;' data-position=" + label.position + "><div class='ui-slider-marker-text' data-position=" + label.position + (this.options.evenSpacing ? "" : " style='transform:" + (this.options.orientation == "horizontal" ? "translateX" : "translateY") + "(calc(" + (-label.position*100 + "% + " + (label.position % 1 == 0 ? (label.position * 2.2 - 1.1) : "0")) + "em))'") + ">" + label.name));
        $(this.options._opacitySliderDiv).prepend(markers);
        if (this.options.orientation == "vertical")
            setTimeout(function() {
                let width = 0;
                markers.children().each(function(i, e) {
                    width = Math.max(width, $(e.childNodes[0]).width());
                });
                $(container).css("paddingLeft", parseInt($(container).css("paddingLeft")) + width + "px")
            }, 0);

        setTimeout(() => update(this.options.initial), 0);

        container = $("<div class='opacity-slider-container " + this.options.orientation.toLowerCase() + "'>").append(this.options._opacitySliderDiv)[0];



        let lastValue;
        function update(value) {
            //_this.options.labels.forEach(label => label._d = Math.abs(label.position - value));
            
            let i = 0, aboveI, belowI;
            while (i < _this.options.labels.length && _this.options.labels[i].position > value) i++;
            if (i < _this.options.labels.length) belowI = i;
            else i--;
            while (i >= 0 && _this.options.labels[i].position < value) i--;
            if (i >= 0) aboveI = i;
            let snap;
            if      (belowI !== undefined && value - _this.options.labels[belowI].position <= (_this.options.labels[belowI].gravitate || _this.options.gravitate) / _this.options.length) { snap = aboveI = belowI; }
            else if (aboveI !== undefined && _this.options.labels[aboveI].position - value <= (_this.options.labels[aboveI].gravitate || _this.options.gravitate) / _this.options.length) { snap = belowI = aboveI; }
            
            if (snap !== undefined) {
                value = _this.options.labels[aboveI].position;
                $(_this.options._opacitySliderDiv).slider("value", _this.options.labels[snap].position * _this.options.length);
            }
            
            if (value === lastValue)
                return snap === undefined;
            lastValue = value;

            let below, above;   
            while (belowI < _this.options.labels.length && (_this.options.labels[belowI].position > value || !_this.options.labels[belowI].layers)) belowI++;
            if (belowI < _this.options.labels.length) below = _this.options.labels[belowI];
            while (aboveI >= 0 && (_this.options.labels[aboveI].position < value || !_this.options.labels[aboveI].layers)) aboveI--;
            if (aboveI >= 0) above = _this.options.labels[aboveI];
            
            if (above == below)
                above = undefined;

            let localValue = above && below ? (value - below.position) / (above.position - below.position) || 0 : 0;

            let pastVisibleLayer = false;
            _this.options.labels.forEach(label => {
                if (!label.layers)
                    return;
                
                let newValue;
                let transition = "";
                if (below == label) {
                    newValue = 1;
                } else if (above == label) {
                    newValue = localValue;
                } else {
                    newValue = 0;
                }
                    
                if (pastVisibleLayer)
                    label.containers.forEach(layer => layer.style.transition = "none");
                else
                    label.containers.forEach(layer => setTimeout(() => layer.style.transition = "", 1));

                if (label.containers[0].style.opacity != newValue) {
                    label.containers.forEach(layer => {

                        if (pastVisibleLayer)
                            setTimeout(() => layer.style.opacity = newValue, 250);
                        else
                            layer.style.opacity = newValue
                    });
                    label.layers.forEach(layer => {
                        layer._opacities[_this.ID] = newValue;
                        updateLayerOpacities(map, layer, true);
                    });
                }

                if (below == label)
                    pastVisibleLayer = true;
            });

            if (_this.options.onChange)
                _this.options.onChange(value, localValue, below, above);
                
            if (snap !== undefined)
                return false;
        }


        
        return container;
    }
});




function updateLayerOpacities(map, layer, delay) {
    if (Object.values(layer._opacities).some(v => v < 0.01) && map.hasLayer(layer) && !layer._t1)  layer._t1 = setTimeout(() => { if (map.hasLayer(layer)) map.removeLayer(layer); layer._t1 = undefined }, delay && 2500);
    if (Object.values(layer._opacities).every(v => v > 0.01)) { if (layer._t1) { clearTimeout(layer._t1); layer._t1 = undefined; } if (!map.hasLayer(layer)) map.addLayer(layer) };
}










L.Control.layerRadioSelector = L.Control.extend({
    options: {
        position: 'topright',
        initial: 0,
        onChange: undefined,
        labels: undefined //example: [ {name: "Sattelite", layers: [..]}, {name: "Drawings", layers: [..]} ]
    },
    onAdd: function (map) {

        if (!map._addLayer) {
            map._addLayer = map.addLayer;
            map.addLayer = function(layer) {
                map._addLayer.call(this, layer);
                if (layer._zcontainer)
                    $(layer._zcontainer).append(layer._container);
            }
        }

        let _this = this, container;
        this.ID = globalID++;

        if (this.options.evenSpacing === undefined)
            this.options.evenSpacing = this.options.orientation == "vertical";

        this.options.labels.sort((a, b) => b.position - a.position);

        this.options.labels.forEach(l => {
            if (l.layers && !l.layers.length)
                l.layers = undefined
        });

        this.options._radioSelectorDiv = $("<form>");
        
        console.log(this.options.initial)
        this.options.labels.forEach((label, i) => {
            _this.options._radioSelectorDiv.append("<label>" + label.name + "<input type='radio' name='radio' value='" + i + "'" + (this.options.initial == i ? " checked" : "") + ">");
            label.layers.forEach(layer => {
                if (!layer._opacities)
                    layer._opacities = {};
                layer._opacities[_this.ID] = _this.options.initial == i ? 1 : 0;
            });
        });
        this.options._radioSelectorDiv.find("input[type='radio']").on("change", e => {
            const newSelected = parseInt(e.target.value);
            _this.options.labels.forEach((label, i) =>
                label.layers.forEach(layer => {
                    layer._opacities[_this.ID] = newSelected == i ? 1 : 0;
                    updateLayerOpacities(map, layer, false);
                })
            )
            if (_this.options.onChange)
                _this.options.onChange(newSelected);
        });
        

        container = $("<div class='radio-selector'>").append(this.options._radioSelectorDiv)[0];





        
        return container;
    }
});