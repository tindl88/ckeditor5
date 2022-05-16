/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEditorInspector, console, document */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

initEditor( ClassicEditor, document.querySelector( '#editor-classic' ), 'classic' );
initEditor( BalloonEditor, document.querySelector( '#editor-balloon' ), 'balloon' );

async function initEditor( editorConstructor, element, name ) {
	const editor = await editorConstructor.create( element, {
		initialData: document.querySelector( '#fixtures' ).innerHTML,
		plugins: [
			Essentials,
			Autoformat,
			BlockQuote,
			Bold,
			Heading,
			Image,
			ImageCaption,
			ImageStyle,
			ImageToolbar,
			ImageResize,
			Indent,
			Italic,
			Link,
			List,
			MediaEmbed,
			Mention,
			Paragraph,
			Table,
			TableToolbar
		],
		toolbar: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'outdent',
			'indent',
			'|',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo'
		],
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side',
				'|',
				'toggleImageCaption',
				'imageTextAlternative'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		mention: {
			feeds: [
				{
					marker: '@',
					feed: [ '@Barney', '@Lily', '@Marshall', '@Robin', '@Ted' ]
				},
				{
					marker: '#',
					feed: [
						'#a01', '#a02', '#a03', '#a04', '#a05', '#a06', '#a07', '#a08', '#a09', '#a10',
						'#a11', '#a12', '#a13', '#a14', '#a15', '#a16', '#a17', '#a18', '#a19', '#a20'
					]
				},
				{
					marker: ':',
					feed: [
						':+1:', ':-1:', ':@(at-sign):', ':$(dollar-sign):', ':#(hash-sign):'
					]
				}
			]
		}
	} );

	CKEditorInspector.attach( { [ name ]: editor } );

	let beforeInputEventCount = 0;
	let compositionEventCount = 0;

	editor.editing.view.document.on( 'keydown', ( evt, evtData ) => {
		if ( evtData.keyCode === 229 ) {
			console.log( '229 was fired' );
		}
	} );

	editor.editing.view.document.on( 'beforeinput', ( evt, evtData ) => {
		const { targetRanges, data, inputType, isComposing } = evtData;

		console.log( 'data', evtData );

		console.group(
			`#${ ++beforeInputEventCount } ` +
			'beforeInput ' +
			`(%c"${ inputType }"%c${ isComposing ? ',%c isComposing' : '%c' }%c)`,
			'color: blue', 'color: default', 'color: green', 'color: default'
		);

		if ( data ) {
			console.log( `%cdata:%c "${ data }"`, 'font-weight: bold', 'font-weight: default' );
		} else {
			console.log( '%cdata:', 'font-weight: bold', data );
		}
		console.log( '%ctargetRanges:', 'font-weight: bold', targetRanges );

		// TODO: Note: In FF sometimes it exists but is null. This should be fixed in inputobserver.
		if ( targetRanges.length && targetRanges[ 0 ] ) {
			console.group( 'first range' );
			console.log( '%cstart:', 'font-weight: bold', targetRanges[ 0 ].start );
			console.log( '%cend:', 'font-weight: bold', targetRanges[ 0 ].end );
			console.log( '%cisCollapsed:', 'font-weight: bold', targetRanges[ 0 ].isCollapsed );
			console.groupEnd( 'first range' );
		}

		// console.log( '%cdataTransfer:', 'font-weight: bold', evtData.dataTransfer );
		// console.log( '%cfull event data:', 'font-weight: bold', evtData );

		console.groupEnd();
	}, { priority: 'highest' } );

	editor.editing.view.document.on( 'compositionstart', ( evt, data ) => {
		console.log(
			`%c┌───────────────────────────── ＃${ ++compositionEventCount } compositionstart ─────────────────────────────┐`,
			'font-weight: bold; color: green'
		);

		console.log( 'compositionstart', data.domEvent );
	}, { priority: 'highest' } );

	editor.editing.view.document.on( 'compositionend', ( evt, data ) => {
		console.log(
			`%c└───────────────────────────── ＃${ compositionEventCount } compositionend ─────────────────────────────┘`,
			'font-weight: bold; color: green'
		);

		console.log( 'compositionend', data.domEvent );
	}, { priority: 'highest' } );
}

let beforeInputEventCount = 0;
let compositionEventCount = 0;

document.addEventListener( 'beforeinput', evt => {
	// Don't log for the editor.
	if ( evt.target.closest( '.ck-content' ) ) {
		return;
	}

	const { inputType, data, isComposing } = evt;

	console.log( 'data', evt, evt.getTargetRanges(), document.getSelection().getRangeAt( 0 ) );

	console.group(
		`#${ ++beforeInputEventCount } ` +
		'native beforeInput ' +
		`(%c"${ inputType }"%c${ isComposing ? ',%c isComposing' : '%c' }%c)`,
		'color: blue', 'color: default', 'color: green', 'color: default'
	);

	if ( data ) {
		console.log( `%cdata:%c "${ data }"`, 'font-weight: bold', 'font-weight: default' );
	} else {
		console.log( '%cdata:', 'font-weight: bold', data );
	}

	console.groupEnd();
} );

document.addEventListener( 'compositionstart', evt => {
	// Don't log for the editor.
	if ( evt.target.closest( '.ck-content' ) ) {
		return;
	}

	console.log(
		`%c┌───────────────────────────── ＃${ ++compositionEventCount } native compositionstart ─────────────────────────────┐`,
		'font-weight: bold; color: green'
	);

	console.log( 'compositionstart', evt );
} );

document.addEventListener( 'compositionend', evt => {
	// Don't log for the editor.
	if ( evt.target.closest( '.ck-content' ) ) {
		return;
	}

	console.log(
		`%c└───────────────────────────── ＃${ compositionEventCount } native compositionend ─────────────────────────────┘`,
		'font-weight: bold; color: green'
	);

	console.log( 'compositionend', evt );
} );
