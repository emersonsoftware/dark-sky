'use strict';
const req = require('request');
const moment = require('moment');
const queryString = require('query-string');
const debug = require('debug')('darksky')

class DarkSky {
    constructor(apiKey, options) {
        debug('options: %o', options)
        debug('apiKey: %s', apiKey)
        this.apiKey = apiKey;
        this.long = null;
        this.lat = null;
        this.t = null;
        this.query = {}
        var url = options ? options.url : undefined
        this.baseUrl = url || 'https://api.darksky.net'
    }

    longitude(long) {
        !long ? null : this.long = long;
        return this;
    }

    latitude(lat) {
        !lat ? null : this.lat = lat;
        return this;
    }

    time(time) {
        !time ? null : this.t = moment(time).format('YYYY-MM-DDTHH:mm:ss');
        return this;
    }

    units(unit) {
        !unit ? null : this.query.units = unit;
        return this;
    }

    language(lang) {
        !lang ? null : this.query.lang = lang;
        return this;
    }

    exclude(blocks) {
        !blocks ? null : this.query.exclude = blocks;
        return this;
    }

    extendHourly(param) {
        !param ? null : this.query.extend = 'hourly';
        return this;
    }

    generateReqUrl() {
        this.url = `${this.baseUrl}/forecast/${this.apiKey}/${this.lat},${this.long}`;
        debug('url: %s', url)
        this.t ? this.url += `,${this.t}` : this.url;
        debug('t: %s', t)
        this.query ? this.url += `?${queryString.stringify(this.query)}` : this.url;
        debug('query: %s', query)
    }

    get() {
        return new Promise((resolve, reject) => {
            if(!this.lat || !this.long) reject("Request not sent. ERROR: Longitute or Latitude is missing.")
            this.generateReqUrl();
            req({ url: this.url, json: true }, (err, res, body) => {
                if (err) {
                    debug('req err: %s', err)
                    reject(`Forecast cannot be retrieved. ERROR: ${err}`)
                    return
                }
                res.statusCode !== 200 ? reject(`Forecast cannot be retrieved. Response: ${res.statusCode} ${res.statusMessage}`) : null;
                resolve(body)
            })
        })
    }
}

module.exports = DarkSky
