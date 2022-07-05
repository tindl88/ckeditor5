/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

type NativeDataTransfer = globalThis.DataTransfer & {
	// We're using this non-standard property https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/mozUserCancelled.
	mozUserCancelled?: boolean;
};

/**
 * @module engine/view/datatransfer
 */

/**
 * A facade over the native [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object.
 */
export default class DataTransfer {
	public readonly files: File[];
	private readonly _native: NativeDataTransfer;

	constructor( nativeDataTransfer: NativeDataTransfer ) {
		/**
		 * The array of files created from the native `DataTransfer#files` or `DataTransfer#items`.
		 *
		 * @readonly
		 * @member {Array.<File>} #files
		 */
		this.files = getFiles( nativeDataTransfer );

		/**
		 * The native DataTransfer object.
		 *
		 * @private
		 * @member {DataTransfer} #_native
		 */
		this._native = nativeDataTransfer;
	}

	/**
	 * Returns an array of available native content types.
	 *
	 * @returns {Array.<String>}
	 */
	public get types(): NativeDataTransfer[ 'types' ] {
		return this._native.types;
	}

	/**
	 * Gets the data from the data transfer by its MIME type.
	 *
	 *		dataTransfer.getData( 'text/plain' );
	 *
	 * @param {String} type The MIME type. E.g. `text/html` or `text/plain`.
	 * @returns {String}
	 */
	public getData( type: string ): string {
		return this._native.getData( type );
	}

	/**
	 * Sets the data in the data transfer.
	 *
	 * @param {String} type The MIME type. E.g. `text/html` or `text/plain`.
	 * @param {String} data
	 */
	public setData( type: string, data: string ): void {
		this._native.setData( type, data );
	}

	/**
	 * The effect that is allowed for a drag operation.
	 *
	 * @param {String} value
	 */
	public set effectAllowed( value: NativeDataTransfer[ 'effectAllowed' ] ) {
		this._native.effectAllowed = value;
	}

	public get effectAllowed(): NativeDataTransfer[ 'effectAllowed' ] {
		return this._native.effectAllowed;
	}

	/**
	 * The actual drop effect.
	 *
	 * @param {String} value
	 */
	public set dropEffect( value: NativeDataTransfer[ 'dropEffect' ] ) {
		this._native.dropEffect = value;
	}

	public get dropEffect(): NativeDataTransfer[ 'dropEffect' ] {
		return this._native.dropEffect;
	}

	/**
	 * Whether the dragging operation was canceled.
	 *
	 * @returns {Boolean}
	 */
	public get isCanceled(): boolean {
		return this._native.dropEffect == 'none' || !!this._native.mozUserCancelled;
	}
}

function getFiles( nativeDataTransfer: NativeDataTransfer ): File[] {
	// DataTransfer.files and items are array-like and might not have an iterable interface.
	const files = Array.from( nativeDataTransfer.files || [] );
	const items = Array.from( nativeDataTransfer.items || [] );

	if ( files.length ) {
		return files;
	}

	// Chrome has empty DataTransfer.files, but allows getting files through the items interface.
	return items
		.filter( item => item.kind === 'file' )
		.map( item => item.getAsFile()! );
}
