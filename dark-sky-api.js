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
        debug('url: %s', this.baseUrl)
    }

    longitude(long) {
        debug('long: %s', long)
        !long ? null : this.long = long;
        return this;
    }

    latitude(lat) {
        debug('lat: %s', lat)
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
        debug('exclude: %s', blocks)
        !blocks ? null : this.query.exclude = blocks;
        return this;
    }

    extendHourly(param) {
        !param ? null : this.query.extend = 'hourly';
        return this;
    }

    generateReqUrl() {
      debug('generate from %o', this)
      this.url = `${this.baseUrl}/forecast/${this.apiKey}/${this.lat},${this.long}`;
      debug('url: %s', this.url)
      this.t ? this.url += `,${this.t}` : this.url;
      debug('t: %s', this.t)
      this.query ? this.url += `?${queryString.stringify(this.query)}` : this.url;
      debug('query: %s', this.query)
    }

    get() {
        debug('get executed')
        return new Promise((resolve, reject) => {
            if(!this.lat || !this.long) reject("Request not sent. ERROR: Longitute or Latitude is missing.")
            this.generateReqUrl();
            req({ url: this.url, json: true }, (err, res, body) => {
                if (err) {
                    debug('req err: %s', err)
                    reject(`Forecast cannot be retrieved. ERROR: ${err}`)
                    return
                }
                debug('get res: %s', res.statusMessage)
                res.statusCode !== 200 ? reject(`Forecast cannot be retrieved. Response: ${res.statusCode} ${res.statusMessage}`) : null;
                debug('get body: %o', body)
                resolve(body)
            })
        })
    }
}

module.exports = DarkSky
