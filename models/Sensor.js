var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Sensor Model
 * =============
 */
var Sensor = new keystone.List('Sensor');

Sensor.add({
    sensorID: {type: Types.Key, required: true, initial: true },
    name: { type: String, required: true },
    description: { type: Types.Html, wysiwyg: true },
    units: { type: Types.TextArray },
    site: { type: Types.Relationship, ref: 'Site' },
    createdAt: { type: Date, default: Date.now },
});

Sensor.defaultSort = '-createdAt';
Sensor.defaultColumns = 'name, description, createdAt';
Sensor.register();