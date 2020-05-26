import test from 'ava';
import * as robot from 'robotjs';
import { Application } from 'spectron';
import { robotActions } from './fixtures/robot-actions';

import {
    getDemoFilePath, loadURL,
    sleep,
    startApplication,
    stopApplication,
    Timeouts,
} from './fixtures/spectron-setup';

let app;

test.before(async (t) => {
    app = await startApplication() as Application;
    t.true(app.isRunning());
});

test.after.always(async () => {
    await stopApplication(app);
});

export const openPopOut = async (window) => {
    if (!window) {
        throw new Error('openPopOut: must be called with Application');
    }
    await window.client.scroll(125, 1500);
    await sleep(Timeouts.threeSec);
    await window.client.click('#open-win');
    await window.client.waitUntilWindowLoaded(Timeouts.fiveSec);
};

test('pop-out: verify that pop-out could be maximized', async (t) => {
    await loadURL(app, getDemoFilePath());
    await app.client.waitUntilWindowLoaded(Timeouts.fiveSec);

    t.log('before pop-out');

    await openPopOut(app);

    t.log('after pop-out');

    await sleep(Timeouts.halfSec);
    t.is(await app.client.getWindowCount(), 2);

    // Select the pop-out
    await app.client.windowByIndex(1);
    await sleep(Timeouts.halfSec);

    // Set full screen
    robotActions.toggleFullscreen();
    t.true(await app.browserWindow.isFullScreen());

    // Exit full screen
    await sleep(Timeouts.halfSec);
    robot.keyTap('escape');
    t.false(await app.browserWindow.isFullScreen());
});
