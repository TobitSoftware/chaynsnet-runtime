import * as jsonCallFunctions from './calls/index';

const jsonCalls = {
    1: jsonCallFunctions.toggleWaitCursor,
    2: jsonCallFunctions.selectTapp,
    4: jsonCallFunctions.showPictures,
    14: jsonCallFunctions.requestGeoLocation,
    16: jsonCallFunctions.showAlert,
    18: jsonCallFunctions.getGlobalData,
    30: jsonCallFunctions.dateTimePicker,
    50: jsonCallFunctions.selectDialog,
    52: jsonCallFunctions.tobitWebTokenLogin,
    54: jsonCallFunctions.tobitLogin,
    56: jsonCallFunctions.tobitLogout,
    72: jsonCallFunctions.showFloatingButton,
    73: jsonCallFunctions.setObjectForKey,
    74: jsonCallFunctions.getObjectForKey,
    75: jsonCallFunctions.addChaynsCallErrorListener,
    77: jsonCallFunctions.setIframeHeight,
    78: jsonCallFunctions.getWindowMetric,
    81: jsonCallFunctions.scrollToPosition,
    92: jsonCallFunctions.updateChaynsId,
    102: jsonCallFunctions.addScrollListener,
    103: jsonCallFunctions.inputDialog,
    112: jsonCallFunctions.sendEventToTopFrame,
    114: jsonCallFunctions.setWebsiteTitle,
    127: jsonCallFunctions.getSavedIntercomChats,
    128: jsonCallFunctions.setIntercomChatData,
    129: jsonCallFunctions.closeWindow,
};

export default jsonCalls;
