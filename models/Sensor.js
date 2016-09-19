var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */
var Sensor = new keystone.List('Sensor');

Sensor.add({
    name: { type: Types.Name, required: true },
    description: { type: Types.Html, wysiwyg: true },
    // units: [],
    site: { type: Types.Relationship, ref: 'Site' },
    createdAt: { type: Date, default: Date.now },
});

Sensor.defaultSort = '-createdAt';
Sensor.defaultColumns = 'name, description, createdAt';
Sensor.register();