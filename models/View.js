var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * View Model
 * =============
 */
var View = new keystone.List('View');

View.add({
    name: { type: String, required: true },
    description: { type: Types.Html, wysiwyg: true },
    site: { type: Types.Relationship, ref: 'Site', required: true, initial: true, noedit: true },
    sensors: { type: Types.Relationship, ref: 'Sensor', many: true, filters: { site: ':site' } },
    priority: { type: Types.Number, format: '0' },
    createdAt: { type: Date, default: Date.now },
});

View.relationship({ path: 'sensors', ref: 'Sensor', refPath: 'View' });


View.defaultSort = '-createdAt';
View.defaultColumns = 'name, overview, createdAt';
View.register();