import { Component } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './_service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Real Time Track';
  name = 'Angular';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date;
  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    public authService: AuthService
  ) {
    // sets an idle timeout of 30 seconds, for testing purposes.
    idle.setIdle(290);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => (this.idleState = 'No longer idle.'));
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.authService.doLogout();
    });
    idle.onIdleStart.subscribe(() => (this.idleState = "You've gone idle!"));
    idle.onTimeoutWarning.subscribe(
      (countdown) =>
        (this.idleState = 'You will time out in ' + countdown + ' seconds!')
    );

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
