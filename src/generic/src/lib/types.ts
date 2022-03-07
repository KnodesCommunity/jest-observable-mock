import { PartialObserver, Subscription } from 'rxjs';
import { RunHelpers, TestScheduler } from 'rxjs/internal/testing/TestScheduler';

import { Notifications } from './marble/a-marble';

import { ColdMarble } from './marble/cold-marble';

export interface MarbleHelpers extends RunHelpers {
	registerSubscription: ( sub: Subscription ) => void;
	triggerOn: <T>( subscriber: PartialObserver<T> | ( ( value: T ) => void ), marbles: string, values?: {[marble: string]: T}, error?: any ) => void;
	<TTimeline extends string = string, TNotifications extends Notifications<any> = Notifications<any>>( timeline: TTimeline, values?: TNotifications ): ColdMarble<TTimeline, TNotifications>;
	<TNotification>( timeline: string, values?: Notifications<TNotification> ): ColdMarble<string, Record<string, TNotification>>;
}

export interface IExtendedTestScheduler {
	/**
	 * Get the original rxjs test scheduler.
	 */
	get(): TestScheduler;
	/**
	 * Run the given [fn] within the test scheduler zone with extended helpers.
	 *
	 * @param fn - The test fn to execute in the test scheduler's zone.
	 */
	run( fn: ( helpers: MarbleHelpers ) => void ): void;
	/**
	 * Prepare a test function executing the given [fn] within the test scheduler zone with extended helpers.
	 *
	 * @param fn - The test fn to execute in the test scheduler's zone.
	 * @example ```
	 * it( 'should execute in zone', scheduler.test( ({ marble }) => {
	 * 	// ...
	 * }))
	 * ```
	 */
	test<TArgs extends any[]>( fn: ( marble: MarbleHelpers, ...args: TArgs ) => void ): ( ...args: TArgs ) => void;
	/**
	 * Register a subscription to unsubscribe at the end of the test.
	 *
	 * @param sub - The subscription to auto-unsubscribe at the end of the test.
	 */
	registerSubscription( sub: Subscription ): void;
}
