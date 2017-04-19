import * as jsonCallFunctions from './json-call-functions';

const jsonCalls = {
    1: jsonCallFunctions.toggleWaitCursor,
    2: jsonCallFunctions.selectTab,
    9: jsonCallFunctions.externOpenUrl,
    14: jsonCallFunctions.requestGeoLocation,
    16: jsonCallFunctions.showDialogAlert,
    18: jsonCallFunctions.getGlobalData,
    30: jsonCallFunctions.dateTimePicker,
    50: jsonCallFunctions.multiSelectDialog,
    52: jsonCallFunctions.tobitWebTokenLogin,
    54: jsonCallFunctions.tobitLogin,
    56: jsonCallFunctions.tobitLogout,
    72: jsonCallFunctions.showFloatingButton,
    73: jsonCallFunctions.setObjectForKey,
    74: jsonCallFunctions.getObjectForKey,
    75: jsonCallFunctions.addChaynsCallErrorListener,
    77: jsonCallFunctions.setIframeHeigth,
    78: jsonCallFunctions.getWindowMetricsCall,
    92: jsonCallFunctions.updateChaynsId,
    103: jsonCallFunctions.showDialogInput,
    112: jsonCallFunctions.sendEventToTopFrame,
    114: jsonCallFunctions.setWebsiteTitle,
    127: jsonCallFunctions.getSavedIntercomChats,
};

export default jsonCalls;
