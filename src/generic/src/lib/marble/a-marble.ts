import { Observable, Subject } from 'rxjs';

import type { MarbleHelpers } from '../types';

export type Notifications<T> = {[key: string]: T; '#'?: any};
export type NotificationValue<T> = T extends Notifications<infer TEmit> ? TEmit : never;

export abstract class AMarble<TTimeline extends string = string, TNotifications extends Readonly<Notifications<any>> | undefined = undefined> {
	protected _observable?: Observable<NotificationValue<TNotifications>>;
	public abstract get observable(): Observable<NotificationValue<TNotifications>>;
	protected get valueError(): [{[key in Exclude<keyof TNotifications, '#'>]: NotificationValue<TNotifications>} | undefined, any] {
		const vals: TNotifications | undefined = this.values ? { ...this.values } : undefined;
		if( vals ){
			delete ( vals as any )['#'];
		}
		return [ vals as any, this.values?.['#'] ];
	}
	public constructor( protected readonly runHelpers: MarbleHelpers, public readonly timeline: TTimeline, public readonly values: TNotifications ){}

	/**
	 * Trigger the given [triggered] using this marble's timeline.
	 * If [triggered] is a function, the value is passed as the 1st & only argument to the function.
	 *
	 * @param triggered - The thing to trigger following the timeline.
	 */
	public trigger( triggered: Subject<NotificationValue<TNotifications>> | ( ( v: NotificationValue<TNotifications> ) => void ) ): void {
		if( typeof triggered === 'function' ){
			this.runHelpers.registerSubscription( this.observable.subscribe( triggered ) );
		} else if( triggered instanceof Observable ){
			this.runHelpers.registerSubscription( this.observable.subscribe( triggered ) );
		}
	}
}
