import { Observable } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler';
import { map } from 'rxjs/operators';

import { AMarble, NotificationValue, Notifications } from './a-marble';
import { HotMarble } from './hot-marble';

export class ColdMarble<TTimeline extends string = string, TNotifications extends Readonly<Notifications<any>> | undefined = undefined>
	extends AMarble<TTimeline, TNotifications> {
	protected _observable?: ColdObservable<NotificationValue<TNotifications>>;
	public get observable(): ColdObservable<NotificationValue<TNotifications>> {
		if( !this._observable ){
			const [ values, error ] = this.valueError;
			this._observable = this.runHelpers.cold( this.timeline, values, error );
		}
		return this._observable;
	}

	/**
	 * Check that the observable emits values matching this marble.
	 *
	 * @param observableOrGetter - The observable to watch, or a function to get the current value.
	 */
	public expectedFrom( observableOrGetter: Observable<NotificationValue<TNotifications>> | ( ( v: NotificationValue<TNotifications> ) => NotificationValue<TNotifications> ) ): void;
	/**
	 * Check that the observable emits values matching this marble with the given subscriptios.
	 *
	 * @param subscriptions - The expected subscriptions on the observable.
	 * @param observable - The observable to watch.
	 */
	public expectedFrom( subscriptions: string, observable: Observable<NotificationValue<TNotifications>> ): void;
	public expectedFrom(
		obsOrSubsOrFn: ( ( v: NotificationValue<TNotifications> ) => NotificationValue<TNotifications> ) | Observable<NotificationValue<TNotifications>> | string,
		obs?: Observable<NotificationValue<TNotifications>>,
	): void {
		let expectObs: ReturnType<TestScheduler['expectObservable']>;
		if( typeof obsOrSubsOrFn === 'function' ){
			const values = Object.fromEntries( Array.from( new Set( this.timeline.match( /\w/g ) ) ).map( s => [ s, this.values?.[s] ] as const ) );
			expectObs = this.runHelpers.expectObservable( this.runHelpers.cold( this.timeline, values ).pipe( map( v => obsOrSubsOrFn( v ) ) ) ) as any;
		} else {
			const [ observable, subs ] = typeof obsOrSubsOrFn === 'string' ? [ obs as Observable<NotificationValue<TNotifications>>, obsOrSubsOrFn ] : [ obsOrSubsOrFn, undefined ];
			expectObs = this.runHelpers.expectObservable( observable, subs ) as any;
		}
		const [ values, error ] = this.valueError;
		expectObs.toBe( this.timeline, values, error );
	}

	/**
	 * Return this marble as a hot observable.
	 *
	 * @returns this marble as a hot observable.
	 */
	public hot(): HotMarble<TTimeline, TNotifications> {
		return new HotMarble( this.runHelpers, this.timeline, this.values );
	}
}
