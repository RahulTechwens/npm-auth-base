class AuthBase {
    constructor(config) {
        this.publicKey = config.publicKey;
        this.apiKey = config.apiKey;
        this.projectId = config.projectId;
    }

    async makeApiCall(endpoint, method, data = null) {
        const fetch = await import('node-fetch').then(mod => mod.default);

        const queryString = data && data.projectId ? data.projectId : '';
        const url = `http://192.168.0.105:4000/api/${endpoint}/${queryString}`;
      
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.apiKey,
                'publickey': this.publicKey
            }
        };

        if (method === 'POST' && data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async initialize(callback) {
        try {
            const response = await this.makeApiCall('project', 'GET', { projectId: this.projectId });
            if (callback) {
                if (Object.keys(response.data).length > 0) {
                    callback(null, "authenticated");
                } else {
                    throw new Error("Something went wrong");
                }
            }
        } catch (error) {
            if (callback) {
                callback(error, null);
            }
        }
    }

    async loginWithEmailPassword(email, password, callback){
        try {
            const response = await this.makeApiCall('user/auth/login/emailpass', 'POST', { email: email, password: password });
            callback(null, response)
        } catch (error) {
            if (callback) {
                callback(error, null);
            }
        }
    }
}

module.exports = AuthBase;
