import { createObservableSpy } from './observable-spy';

describe( 'createObservableSpy', () => {
	it( 'should support multiple calls to `mockReturnValue`', () => {
		const mockFn = createObservableSpy();
		const mockFn2 = mockFn.mockReturnValue( 1 ).mockReturnValue( 2 ).mockReturnValue( 3 );
		expect( mockFn2 ).toBe( mockFn );
		expect( mockFn2 ).not.toHaveBeenCalled();
		expect( mockFn2() ).toEqual( 3 );
		expect( mockFn2 ).toHaveBeenCalledTimes( 1 );
	} );
} );
