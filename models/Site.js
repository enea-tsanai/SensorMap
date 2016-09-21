var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Site Model
 * =============
 */
var Site = new keystone.List('Site');

Site.add({
    name: { type: String, required: true },
    overview: { type: Types.Html, wysiwyg: true },
    description: { type: Types.Html, wysiwyg: true },
    location: { type: Types.Location, defaults: { country: 'Unites States' }, required: true, initial: true},
    // sensors: { type: Types.Relationship, ref: 'Sensor', many: true },
    createdAt: { type: Date, default: Date.now },
});

Site.relationship({ path: 'sensors', ref: 'Sensor', refPath: 'site' });


Site.defaultSort = '-createdAt';
Site.defaultColumns = 'name|10%, overview, createdAt|15%';
Site.register();