export default class Textstrings {
    static init() {
        return new Promise((resolve, reject) => {
            chayns.utils.lang.init({
                libs: [{
                    project: 'DavidAdministration', //Project Name
                    middle: 'LangRes'
                }],
                successCallback: () => {
                    save();
                    chayns.utils.lang.renderTextStrings(document.body);
                    resolve();
                },
                errorCallback: reject
            });
        })
    }

    static get = {};
}

function save() {
    Textstrings.get = {
        login: {
            loginfailed: chayns.utils.lang.get('txt_david_administration_login_loginfailed') || ''
        },
        intro: {
            text: chayns.utils.lang.get('txt_david_administration_site_intro_text') || ''
        },
        information: {
            duration: {
                ends: chayns.utils.lang.get('txt_david_administration_site_information_duration_ends') || '',
                trail: chayns.utils.lang.get('txt_david_administration_site_information_duration_trail') || '',
                perpetual: chayns.utils.lang.get('txt_david_administration_site_information_duration_perpetual') || ''
            },
            payment: {
                creditcard: chayns.utils.lang.get('txt_david_administration_site_information_payment_creditcard') || '',
                bank: chayns.utils.lang.get('txt_david_administration_site_information_payment_bank') || ''
            },
            dialog: {
                SiteCare: {
                    confirm: chayns.utils.lang.get('txt_david_administration_site_information_dialog_sitecare_confirm') || '',
                    cancelFailed: chayns.utils.lang.get('txt_david_administration_site_information_dialog_sitecare_cancelFailed') || ''
                }
            }
        }
    }
}