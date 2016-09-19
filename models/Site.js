var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */
var Site = new keystone.List('Site');

Site.add({
    name: { type: Types.Name, required: true },
    overview: { type: Types.Html, wysiwyg: true },
    description: { type: Types.Html, wysiwyg: true },
    sensors: { type: Types.Relationship, ref: 'Sensor' },
    createdAt: { type: Date, default: Date.now },
});

Site.defaultSort = '-createdAt';
Site.defaultColumns = 'name, overview, createdAt';
Site.register();