/**
 * Unit tests for Troop Avatar Generator
 * Tests utility functions and constants
 */

const { describe, test, expect } = require('@jest/globals');

// Mock jQuery for testing
global.jQuery = null;

const troop = require('../js/troop.js');

describe('Troop Utility Functions', () => {
	describe('ucfirst()', () => {
		test('should capitalize first letter of lowercase string', () => {
			expect(troop.ucfirst('hello')).toBe('Hello');
		});

		test('should capitalize first letter of uppercase string', () => {
			expect(troop.ucfirst('WORLD')).toBe('WORLD');
		});

		test('should handle single character', () => {
			expect(troop.ucfirst('a')).toBe('A');
		});

		test('should handle empty string', () => {
			expect(troop.ucfirst('')).toBe('');
		});

		test('should handle string with spaces', () => {
			expect(troop.ucfirst('hello world')).toBe('Hello world');
		});

		test('should handle string starting with number', () => {
			expect(troop.ucfirst('123abc')).toBe('123abc');
		});

		test('should handle string with special characters', () => {
			expect(troop.ucfirst('!hello')).toBe('!hello');
		});
	});

	describe('clean()', () => {
		test('should remove dots from string', () => {
			expect(troop.clean('test.file')).toBe('testfile');
		});

		test('should remove hyphens from string', () => {
			expect(troop.clean('test-file')).toBe('testfile');
		});

		test('should remove both dots and hyphens', () => {
			expect(troop.clean('test.file-name')).toBe('testfilename');
		});

		test('should handle string with no dots or hyphens', () => {
			expect(troop.clean('testfile')).toBe('testfile');
		});

		test('should handle empty string', () => {
			expect(troop.clean('')).toBe('');
		});

		test('should remove only first occurrence of dot', () => {
			expect(troop.clean('test.file.gif')).toBe('testfile.gif');
		});

		test('should remove only first occurrence of hyphen', () => {
			expect(troop.clean('test-file-name')).toBe('testfile-name');
		});

		test('should handle string with multiple special characters', () => {
			expect(troop.clean('layer_item_body_skeleton.gif-0x0')).toBe('layer_item_body_skeletongif0x0');
		});
	});

	describe('Constants', () => {
		test('bodyCanvasWidth should be 91', () => {
			expect(troop.bodyCanvasWidth).toBe(91);
		});

		test('layerMargin should be 10', () => {
			expect(troop.layerMargin).toBe(10);
		});

		test('layerAllowMany should be correctly configured', () => {
			expect(troop.layerAllowMany).toEqual({
				body: false,
				hair: true,
				hats: true,
				pants: false,
				bottoms: false,
				tops: true,
				shoes: false,
				extras: false
			});
		});

		test('layerAllowMany should have correct boolean values', () => {
			expect(typeof troop.layerAllowMany.body).toBe('boolean');
			expect(typeof troop.layerAllowMany.hair).toBe('boolean');
			expect(typeof troop.layerAllowMany.hats).toBe('boolean');
		});

		test('layerAllowMany should allow multiple items for hair', () => {
			expect(troop.layerAllowMany.hair).toBe(true);
		});

		test('layerAllowMany should not allow multiple items for body', () => {
			expect(troop.layerAllowMany.body).toBe(false);
		});
	});
});

describe('Troop Integration Tests', () => {
	describe('String manipulation edge cases', () => {
		test('ucfirst should work with unicode characters', () => {
			expect(troop.ucfirst('über')).toBe('Über');
		});

		test('clean should handle layer item IDs correctly', () => {
			const testId = 'layer_item_body_skeleton.gif-0x0';
			const cleaned = troop.clean(testId);
			expect(cleaned).not.toContain('.');
			expect(cleaned.indexOf('-')).toBe(-1);
		});

		test('ucfirst with clean should produce valid layer names', () => {
			const layerName = 'body';
			const capitalized = troop.ucfirst(layerName);
			expect(capitalized).toBe('Body');
		});
	});

	describe('Constants validation', () => {
		test('all layer types in layerAllowMany should be strings', () => {
			const keys = Object.keys(troop.layerAllowMany);
			keys.forEach(key => {
				expect(typeof key).toBe('string');
			});
		});

		test('bodyCanvasWidth should be positive number', () => {
			expect(troop.bodyCanvasWidth).toBeGreaterThan(0);
			expect(typeof troop.bodyCanvasWidth).toBe('number');
		});

		test('layerMargin should be positive number', () => {
			expect(troop.layerMargin).toBeGreaterThan(0);
			expect(typeof troop.layerMargin).toBe('number');
		});
	});
});
