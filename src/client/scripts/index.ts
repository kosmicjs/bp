/**
 * This file is used for importing all the scripts that are used in the application.
 *
 * This file is the main entry point for the frontend application and vite bundler.
 *
 * Note: order does matter here if you set some type of global functionallity
 */
import 'vite/modulepreload-polyfill';
import '@popperjs/core';
import 'bootstrap';
import 'htmx.org';
import '../styles/styles.scss';
import './query.js';
import './islands.js';
import './socket.js';
