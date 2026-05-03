export class helloid {

    static config = null;
    static ready = null;
    static authLock = false;
    static #token = null;

    static init() {

        this.ready = fetch(new URL('assx/com.manifest.helloid.dexly.json', import.meta.url))
            .then(res => res.json())
            .then(res => {

                this.config = res;

                const eventd = {
                    service: 'com.dexly.helloid',
                    event: 'init',
                    state: 200
                };

                window.dispatchEvent(new CustomEvent('helloid:ready', {
                    detail: { event: eventd, config: res }
                }));

                return true;

            })
            .catch(err => {

                console.error('HelloID init error:', err);
                return false;

            });

        return this.ready;
    }

    static async auth(username) {

        if (this.authLock) return;
        this.authLock = true;

        await this.ready;

        const cfg = this.config;

        const serve =
            `${cfg.service.data.protocol}//${cfg.service.data.domain}/` +
            `${cfg.service.data.version}/${cfg.service.data.target}` +
            `?bundleToken=${cfg.credentials.token}` +
    `${username ? `&d0ebc752b6=${username}` : ''}`;

        const width = 1150;
        const height = 720;

        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            serve,
            "_blank",
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {

            this.authLock = false;

            window.dispatchEvent(new CustomEvent('helloid:error', {
                detail: {
                    event: {
                        service: 'com.dexly.helloid',
                        event: 'popup_blocked',
                        state: 403
                    }
                }
            }));

            return;
        }

        const checker = setInterval(() => {

            if ((!popup || popup.closed) && !this.#token) {

                clearInterval(checker);
                this.authLock = false;

                window.dispatchEvent(new CustomEvent('helloid:error', {
                    detail: {
                        event: {
                            service: 'com.dexly.helloid',
                            event: 'aborted',
                            state: 499
                        }
                    }
                }));

                return;
            }

            if (this.#token) {
                clearInterval(checker);
            }

        }, 500);

        return this.#waitx(popup, checker);
    }

    static async #waitx(popup, checker) {

        return new Promise((resolve, reject) => {

            const timeout = setTimeout(() => {

                window.removeEventListener('message', handler);
                clearInterval(checker);
                this.authLock = false;

                reject({
                    state: 408,
                    message: 'timeout'
                });

            }, 60000);

            const handler = async (event) => {

                const message = event.data;

                if (!message || typeof message !== 'object') return;
                if (message.id !== 'com.token.helloid') return;

                window.removeEventListener('message', handler);
                clearTimeout(timeout);
                clearInterval(checker);

                try {

                    if (Number(message.state) === 200) {

                        this.#token = message.token;

                        const exchange = await this.#exchange(message.token);

                        if (Number(exchange.code) === 200) {

                            this.authLock = false;
                            popup?.close?.();

                            const eventd = {
                                service: 'com.dexly.helloid',
                                event: 'login:success',
                                state: 200
                            };

                            window.dispatchEvent(new CustomEvent('helloid:success', {
                                detail: {
                                    event: eventd,
                                    account: exchange.account
                                }
                            }));

                            resolve(exchange.account);

                        } else {

                            this.authLock = false;

                            const eventd = {
                                service: 'com.dexly.helloid',
                                event: 'login:error',
                                state: exchange.code
                            };

                            window.dispatchEvent(new CustomEvent('helloid:error', {
                                detail: {
                                    event: eventd,
                                    state: exchange.code,
                                    phase: exchange.phase
                                }
                            }));

                            reject(exchange);
                        }

                    } else if (Number(message.state) === 499) {

                        this.authLock = false;

                        const eventd = {
                            service: 'com.dexly.helloid',
                            event: 'aborted',
                            state: 499
                        };

                        window.dispatchEvent(new CustomEvent('helloid:error', {
                            detail: {
                                event: eventd,
                                description: 'El cliente abortó el inicio de sesión.'
                            }
                        }));

                        reject(eventd);
                    }

                } catch (error) {

                    this.authLock = false;

                    const eventd = {
                        service: 'com.dexly.helloid',
                        event: 'exchange:error',
                        state: 500
                    };

                    window.dispatchEvent(new CustomEvent('helloid:error', {
                        detail: { event: eventd, error }
                    }));

                    reject(error);
                }
            };

            window.addEventListener('message', handler);
        });
    }

    static async #exchange(token) {

        try {

            const res = await fetch(new URL('assx/com.endpoint.php', import.meta.url), {
                method: 'POST',
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({ token })
            });

            return await res.json();

        } catch (error) {

            console.error('Exchange error:', error);
            throw error;
        }
    }

    static getVersion(){

        return{

            mode: 'com.dex.platform',
            version: '7.1.5',
            developer: 'Roger Salinas',
            vendor: 'Dexly Studios LLC',
            build: '2026.04.20',
            dexagent: 'com.dex.dexagent/7.1.5 (cxi=true; env=production; arch=x64; platform=web; vendor=Dexly Studios LLC)',
            packagename: 'com.dexly.helloid',
            copyright: '© 2026 Dexly Studios LLC.',
            dxacompilation: '2026042001•2024111601',
            fingerprint: 'CA:F6:84:94:47:2B:30:AB:BB:9D:E3:40:03:8B:A6:DC:2B:B7:AF:9D:71:32:C5:12:A6:1D:36:1D:9B:AC:BD:3D',
            state: 200

        }

    }

    static getProcessor(){

        return {         

            name: "CrossFlex Processor",
            serie: "X",
            model: "X8-20U5G4",
            manufacturer: "Dexly Studios LLC",
            version: "198.195.2024",
            cores: "4",
            architecture: "x64 ARM (64 Bits)",
            protocol: "bootx.drm",
            gen: "12",
            frecuency: "3.00GHz",
            completeName: "12th Gen Dexly(R) X(TM) X8-20U5G4 @ 3.00GHz  2.90 GHz",
            defaultSlot: "X-TPS:CrossFlex_HKEY_CLASSES_ROOT/DRM.flx",
            kernel: "CrossFlex-5.15.0-67-generic",
            developer: "Roger Salinas",
            engineType: "com.dex.platform",

        }

    }

}