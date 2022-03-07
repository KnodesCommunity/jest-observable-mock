import { HotObservable } from 'rxjs/internal/testing/HotObservable';

import { AMarble, NotificationValue, Notifications } from './a-marble';

export class HotMarble<TTimeline extends string = string, TNotifications extends Readonly<Notifications<any>> | undefined = undefined>
	extends AMarble<TTimeline, TNotifications> {
	protected _observable?: HotObservable<NotificationValue<TNotifications>>;
	public get observable(): HotObservable<NotificationValue<TNotifications>> {
		if( !this._observable ){
			const [ values, error ] = this.valueError;
			this._observable = this.runHelpers.hot( this.timeline, values, error );
		}
		return this._observable;
	}
}
