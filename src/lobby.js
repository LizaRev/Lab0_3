export class Lobby extends EventTarget {

  constructor() {
    super();

    this.rooms = [];
    this.playerName = '';

    this.controller = null;
    this.refreshTimer = null;
  }

  setPlayerName(name) {
    this.playerName = name.trim();
  }

  async refresh() {

    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();

    const controller = this.controller;

    const timeoutSignal =
      AbortSignal.timeout(5000);

    const handleTimeout = () => {
      controller.abort();
    };

    timeoutSignal.addEventListener(
      'abort',
      handleTimeout,
      { once: true }
    );

    try {

      const response = await fetch(
        '/api/rooms.json',
        {
          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const rooms =
        await response.json();

      this.rooms = rooms;

      this.dispatchEvent(
        new CustomEvent(
          'roomsUpdated',
          {
            detail: {
              rooms: this.rooms
            }
          }
        )
      );

      return this.rooms;

    } catch (error) {

      if (error.name === 'AbortError') {
        return;
      }

      console.error(
        'Не вдалося завантажити кімнати:',
        error
      );

    } finally {

      timeoutSignal.removeEventListener(
        'abort',
        handleTimeout
      );

    }
  }

  startAutoRefresh(interval = 5000) {

    this.stopAutoRefresh();

    this.refresh();

    this.refreshTimer =
      setInterval(
        () => {
          this.refresh();
        },
        interval
      );
  }

  stopAutoRefresh() {

    if (this.refreshTimer) {

      clearInterval(
        this.refreshTimer
      );

      this.refreshTimer = null;
    }

    if (this.controller) {

      this.controller.abort();

      this.controller = null;
    }
  }

  join(roomId) {

    const room =
      this.rooms.find(
        (item) =>
          item.id === roomId
      );

    if (!room) {

      throw new Error(
        `Кімнату ${roomId} не знайдено`
      );
    }

    this.stopAutoRefresh();

    this.dispatchEvent(
      new CustomEvent(
        'joined',
        {
          detail: {
            room,
            playerName: this.playerName
          }
        }
      )
    );
  }
}