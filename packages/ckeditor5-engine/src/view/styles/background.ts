/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module engine/view/styles/background
 */

import type { StylesProcessor, PropertyDescriptor, StyleValue, Styles, Normalizer, Reducer } from '../stylesmap';
import { getShorthandValues, isAttachment, isColor, isPosition, isRepeat, isURL } from './utils';

/**
 * Adds a background CSS styles processing rules.
 *
 *		editor.data.addStyleProcessorRules( addBackgroundRules );
 *
 * The normalized value is stored as:
 *
 *		const styles = {
 *			background: {
 *				color,
 *				repeat,
 *				position,
 *				attachment,
 *				image
 *			}
 *		};
 *
 * **Note**: Currently only `'background-color'` longhand value is parsed besides `'background'` shorthand. The reducer also supports only
 * `'background-color'` value.
 *
 * @param {module:engine/view/stylesmap~StylesProcessor} stylesProcessor
 */
export function addBackgroundRules( stylesProcessor: StylesProcessor ): void {
	stylesProcessor.setNormalizer( 'background', getBackgroundNormalizer() );
	stylesProcessor.setNormalizer( 'background-color', getBackgroundColorNormalizer() );
	stylesProcessor.setReducer( 'background', getBackgroundReducer() );

	stylesProcessor.setStyleRelation( 'background', [ 'background-color' ] );
}

function getBackgroundNormalizer(): Normalizer {
	return value => {
		const background: StyleValue = {};

		const parts = getShorthandValues( value );

		for ( const part of parts ) {
			if ( isRepeat( part ) ) {
				if ( !Array.isArray( background.repeat ) ) {
					background.repeat = [];
				}

				background.repeat.push( part );
			} else if ( isPosition( part ) ) {
				if ( !Array.isArray( background.position ) ) {
					background.position = [];
				}

				background.position.push( part );
			} else if ( isAttachment( part ) ) {
				background.attachment = part;
			} else if ( isColor( part ) ) {
				background.color = part;
			} else if ( isURL( part ) ) {
				background.image = part;
			}
		}

		return {
			path: 'background',
			value: background
		};
	};
}

function getBackgroundColorNormalizer(): Normalizer {
	return value => ( { path: 'background.color', value } );
}

function getBackgroundReducer(): Reducer {
	return value => {
		const ret: PropertyDescriptor[] = [];

		ret.push( [ 'background-color', ( value as Styles ).color as string ] );

		return ret;
	};
}
