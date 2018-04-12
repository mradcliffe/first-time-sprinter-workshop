import Reveal from 'reveal.js/js/reveal';

/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 *
 * Handshake process:
 * 1. This window posts 'connect' to notes window
 *    - Includes URL of presentation to show
 * 2. Notes window responds with 'connected' when it is available
 * 3. This window proceeds to send the current presentation state
 *    to the notes window
 */
export default class RevealNotes {
  constructor() {
    if (!/receiver/i.test(window.location.search)) {
      // If the there's a 'notes' query set, open directly
      if (window.location.search.match(/(\?|&)notes/gi) !== null) {
        this.openNotes();
      }
    }
  }
  static openNotes() {
    const notesPopup = window.open('./notes.html', 'reveal.js - Notes', 'width=1100,height=700');

    /**
     * Posts the current slide data to the notes window
     */
    function post() {
      const slideElement = Reveal.getCurrentSlide();
      const notesElement = slideElement.querySelector('aside.notes');
      const messageData = {
        namespace: 'reveal-notes',
        type: 'state',
        notes: '',
        markdown: false,
        state: Reveal.getState(),
      };

      // Look for notes defined in a slide attribute.
      if (slideElement.hasAttribute('data-notes')) {
        messageData.notes = slideElement.getAttribute('data-notes');
      }

      // Look for notes defined in an aside element.
      if (notesElement) {
        messageData.notes = notesElement.innerHTML;
        messageData.markdown = false;
        // typeof notesElement.getAttribute('data-markdown') === 'string';
      }

      notesPopup.postMessage(JSON.stringify(messageData), '*');
    }

    /**
     * Called once we have established a connection to the notes
     * window.
     */
    function onConnected() {
      Reveal.addEventListener('slidechanged', post);
      Reveal.addEventListener('fragmentshown', post);
      Reveal.addEventListener('fragmenthidden', post);
      Reveal.addEventListener('overviewhidden', post);
      Reveal.addEventListener('overviewshown', post);
      Reveal.addEventListener('paused', post);
      Reveal.addEventListener('resumed', post);

      post();
    }

    /**
     * Connect to the notes window through a postmessage handshake.
     * Using postmessage enables us to work in situations where the
     * origins differ, such as a presentation being opened from the
     * file system.
     */
    function connect() {
      // Keep trying to connect until we get a 'connected' message back.
      const connectInterval = setInterval(() => {
        const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
        notesPopup.postMessage(JSON.stringify({
          namespace: 'reveal-notes',
          type: 'connect',
          url,
          state: Reveal.getState(),
        }), '*');
      }, 500);

      window.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data && data.namespace === 'reveal-notes' && data.type === 'connected') {
          clearInterval(connectInterval);
          onConnected();
        }
      });
    }

    connect();
  }
}
