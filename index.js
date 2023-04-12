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

// Create source.
var source = Marzipano.ImageUrlSource.fromString(
    "./img/Plaza del ayuntamiento 4K.jpg"//"//www.marzipano.net/media/equirect/angra.jpg"//"//cdn.glitch.global/b1bc1c82-f64e-4d5c-a42c-466b59eb91ce/Plaza%20del%20ayuntamiento%208K.jpg?v=1681220070399"//"./img/Plaza del ayuntamiento 8K.jpg"
);


// Create geometry.
var geometry = new Marzipano.EquirectGeometry([{ width: 4096}]);

//Initial View
var initialView = {
  yaw: -3.037993090671444,
  pitch: -0.22731284405465857,
  fov: 1.2933824216075565
};




// Create view.
var limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);

// Descomentar esta si queremos una posicion inicial distinta, si no la default
//var view = new Marzipano.RectilinearView(initialView, limiter);
var view = new Marzipano.RectilinearView(null, limiter);

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
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

/*
var options = {
  transitionDuration: 2000
}*/

function ocultarPanel(){
  document.getElementById('panel').style.display = 'none';
  enable();
  console.log("Ocultado 27");
  
  //scene.lookTo(initialView, options, enable);
  
}