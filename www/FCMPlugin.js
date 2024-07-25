var exec = require("cordova/exec");
var cordova = require("cordova");

function FCMPlugin() {
  console.log("FCMPlugin.js: is created");
}

// CHECK FOR PERMISSION
FCMPlugin.prototype.hasPermission = function (success, error) {
  if (cordova.platformId !== "ios") {
    success(true);
    return;
  }
  exec(success, error, "FCMPlugin", "hasPermission", []);
};

// SUBSCRIBE TO TOPIC //
FCMPlugin.prototype.subscribeToTopic = function (topic, success, error) {
  exec(success, error, "FCMPlugin", "subscribeToTopic", [topic]);
};

// UNSUBSCRIBE FROM TOPIC //
FCMPlugin.prototype.unsubscribeFromTopic = function (topic, success, error) {
  exec(success, error, "FCMPlugin", "unsubscribeFromTopic", [topic]);
};

// NOTIFICATION CALLBACK //
FCMPlugin.prototype.onNotification = function (callback, success, error) {
  FCMPlugin.prototype.onNotificationReceived = callback;
  exec(success, error, "FCMPlugin", "registerNotification", []);
};

// TOKEN REFRESH CALLBACK //
FCMPlugin.prototype.onTokenRefresh = function (callback) {
  FCMPlugin.prototype.onTokenRefreshReceived = callback;
};

// GET TOKEN //
FCMPlugin.prototype.getToken = function (success, error) {
  exec(success, error, "FCMPlugin", "getToken", []);
};

// GET APNS TOKEN //
FCMPlugin.prototype.getAPNSToken = function (success, error) {
  if (cordova.platformId !== "ios") {
    success(null);
    return;
  }
  exec(success, error, "FCMPlugin", "getAPNSToken", []);
};

// CLEAR ALL NOTIFICATIONS //
FCMPlugin.prototype.clearAllNotifications = function (success, error) {
  exec(success, error, "FCMPlugin", "clearAllNotifications", []);
};

// REQUEST IOS PUSH PERMISSION //
FCMPlugin.prototype.requestPushPermission = function (success, error, options) {
  // For iOS
  if (cordova.platformId === "ios") {
    var ios9SupportTimeout = 10;
    var ios9SupportInterval = 0.3;
    if (options && options.ios9Support && options.ios9Support.timeout) {
      ios9SupportTimeout = options.ios9Support.timeout;
    }
    if (options && options.ios9Support && options.ios9Support.interval) {
      ios9SupportInterval = options.ios9Support.interval;
    }
    exec(success, error, "FCMPlugin", "requestPushPermission", [
      ios9SupportTimeout,
      ios9SupportInterval
    ]);
  } else if (cordova.platformId === "android") {
    // For Android 13+
    if (parseInt(device.version) >= 33) {
      var permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.POST_NOTIFICATIONS, function (status) {
        if (status.hasPermission) {
          if (typeof success !== "undefined") {
            success(true);
          }
        } else {
          permissions.requestPermission(permissions.POST_NOTIFICATIONS, function (status) {
            if (status.hasPermission) {
              if (typeof success !== "undefined") {
                success(true);
              }
            } else {
              if (typeof error !== "undefined") {
                error('Permission denied');
              }
            }
          }, function (err) {
            if (typeof error !== "undefined") {
              error('Permission request failed: ' + err);
            }
          });
        }
      }, function (err) {
        if (typeof error !== "undefined") {
          error('Permission check failed: ' + err);
        }
      });
    } else {
      if (typeof success !== "undefined") {
        success(true);
      }
    }
  } else {
    if (typeof success !== "undefined") {
      success(true);
    }
  }
};



// REQUEST THE CREATION OF A NOTIFICATION CHANNEL //
FCMPlugin.prototype.createNotificationChannelAndroid = function (channelConfig, success, error) {
  if (cordova.platformId === "android") {
    exec(success, error, "FCMPlugin", "createNotificationChannel", [channelConfig]);
  }
};

// DEFAULT NOTIFICATION CALLBACK //
FCMPlugin.prototype.onNotificationReceived = function (payload) {
  console.log("Received push notification");
  console.log(payload);
};

// DEFAULT TOKEN REFRESH CALLBACK //
FCMPlugin.prototype.onTokenRefreshReceived = function (token) {
  console.log("Received token refresh");
  console.log(token);
};

// FIRE READY //
exec(
  function (result) {
    console.log("FCMPlugin Ready OK");
  },
  function (result) {
    console.log("FCMPlugin Ready ERROR");
  },
  "FCMPlugin",
  "ready",
  []
);

var fcmPlugin = new FCMPlugin();
module.exports = fcmPlugin;
