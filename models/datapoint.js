var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Datapoint Model
 * =============
 */
var Datapoint = new keystone.List('Datapoint');

Datapoint.add({
    sensorID: { type: Types.Key, required: true, initial: true },
    timeValue: { type: Types.Datetime, required: true },
    value: { type: Types.Number, required: true }
});

Datapoint.defaultSort = '-createdAt';
Datapoint.defaultColumns = 'sensorID, timeValue, value';
Datapoint.register();