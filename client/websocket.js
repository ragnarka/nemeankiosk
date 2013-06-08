if (Meteor.isClient) {
    Meteor._DdpClientStream.prototype._launch_connection = function () {
        var self = this;
        self._cleanup_socket(); // cleanup the old socket, if there was one.

        self.socket = new SockJS(self.url, undefined, { debug: false});

        // ********* Disable the whitelist, allow all protocols (esp websocket!) *************
        //, protocols_whitelist: [
        //    // only allow polling protocols. no websockets or streaming.
        //    // streaming makes safari spin, and websockets hurt chrome.
        //    'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling'
        //  ]});

        self.socket.onmessage = function (data) {
          // first message we get when we're connecting goes to _connected,
          // which connects us. All subsequent messages (while connected) go to
          // the callback.
          if (self.current_status.status === "connecting")
            self._connected(data.data);
          else if (self.current_status.connected)
            _.each(self.event_callbacks.message, function (callback) {
              callback(data.data);
            });

          self._heartbeat_received(); // *********** this causes timers to be created/destroyed multiple times a frame :P
        };
        self.socket.onclose = function () {
          // Meteor._debug("stream disconnect", _.toArray(arguments), (new Date()).toDateString());
          self._disconnected();
        };
        self.socket.onerror = function () {
          // XXX is this ever called?
          Meteor._debug("stream error", _.toArray(arguments), (new Date()).toDateString());
        };

        self.socket.onheartbeat =  function () {
          self._heartbeat_received();
        };

        if (self.connection_timer)
          clearTimeout(self.connection_timer);
        self.connection_timer = setTimeout(
          _.bind(self._fake_connect_failed, self),
          self.CONNECT_TIMEOUT);
    };    

    /// ********** restart connection *******
    Meteor.reconnect({_force: true});
}