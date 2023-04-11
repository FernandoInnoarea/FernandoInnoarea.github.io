/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Register the custom control method.
var deviceOrientationControlMethod = new DeviceOrientationControlMethod();
var controls = viewer.controls();
controls.registerMethod('deviceOrientation', deviceOrientationControlMethod);
/*
// Create source.
var source = Marzipano.ImageUrlSource.fromString(
  "//www.marzipano.net/media/cubemap/{f}.jpg"
);

// Create geometry.
var geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

// Create view.
var limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
var view = new Marzipano.RectilinearView(null, limiter);

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});*/


// Create scenes.
var scenes = data.scenes.map(function(data) {
  var urlPrefix = "tiles";
  var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg" });
  var geometry = new Marzipano.CubeGeometry(data.levels);

  var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, 100*Math.PI/180, 120*Math.PI/180);
  var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });
  /*
  // Create link hotspots.
  data.linkHotspots.forEach(function(hotspot) {
    var element = createLinkHotspotElement(hotspot);
    scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
  });

  // Create info hotspots.
  data.infoHotspots.forEach(function(hotspot) {
    var element = createInfoHotspotElement(hotspot);
    scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
  });
  */
  return {
    data: data,
    scene: scene,
    view: view
  };
});











// Display scene.
scene.switchTo();

// Set up control for enabling/disabling device orientation.

var enabled = false;

var toggleElement = document.getElementById('toggleDeviceOrientation');

function requestPermissionForIOS() {
  window.DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response === 'granted') {
        enableDeviceOrientation();
      }
    }).catch((e) => {
      console.error(e)
    })
}

function enableDeviceOrientation() {
  deviceOrientationControlMethod.getPitch(function (err, pitch) {
    if (!err) {
      view.setPitch(pitch);
    }
  });
  controls.enableMethod('deviceOrientation');
  enabled = true;
  toggleElement.className = 'enabled';
}

function enable() {
  if (window.DeviceOrientationEvent) {
    if (typeof (window.DeviceOrientationEvent.requestPermission) == 'function') {
      requestPermissionForIOS();
    } else {
      enableDeviceOrientation();
    }
  }
}

function disable() {
  controls.disableMethod('deviceOrientation');
  enabled = false;
  toggleElement.className = '';
}

function toggle() {
  if (enabled) {
    disable();
  } else {
    enable();
  }
}

toggleElement.addEventListener('click', toggle);


function ocultarPanel(){
  document.getElementById('panel').style.display = 'none';
  enable();
}