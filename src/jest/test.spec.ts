import { TestScheduler } from 'rxjs/testing';

import { buildMarbleHelper } from '@knodes/rxjs-testing-utils/generic';

import { createObservableSpy } from './src';

it( 'should pass', () => {
	const scheduler = new TestScheduler( ( actual, expected ) => expect( actual ).toEqual( expected ) );
	scheduler.run( helpers => {
		const marble = buildMarbleHelper( helpers );
		helpers.expectObservable( marble( '--a', { a: 1 } ).observable ).toBe( '--a', { a: 1 } );
		marble( '--a', { a: 2 } ).expectedFrom( marble( '--a', { a: 2 } ).observable );

		const mock = marble( 'a', { a: 3 } );
		const spyFn = createObservableSpy( () => mock.observable );
		marble( '--a', { a: 4 } ).trigger( v => spyFn( v ) );
		marble( '--a', { a: [ 4 ] } ).expectedFrom( spyFn.calls$ );

		const mock2 = marble( 'a', { a: 6 } );
		const spyFn2 = createObservableSpy( () => mock.observable );
		spyFn2.mockReturnValue( mock2.observable );
		marble( '----a', { a: 5 } ).trigger( v => spyFn2( v ) );
		marble( '----a', { a: [ 5 ] } ).expectedFrom( spyFn2.calls$ );

		const mock3 = marble( 'a', { a: 7 } );
		const spyFn3 = createObservableSpy( () => mock3.observable );
		marble( 'a', { a: 7 } ).expectedFrom( spyFn3() );
	} );
} );
