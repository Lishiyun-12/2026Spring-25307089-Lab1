import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import type { BusinessError } from "@ohos:base";
export default class entryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        this.permissions();
        hilog.isLoggable(0x0000, 'EntryAbility', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onCreate');
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'want param:' + JSON.stringify(want) ?? '');
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'launchParam:' + JSON.stringify(launchParam) ?? '');
    }
    onDestroy(): void | Promise<void> {
        hilog.isLoggable(0x0000, 'EntryAbility', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // Main window is created, set main page for this ability.
        hilog.isLoggable(0x0000, 'EntryAbility', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onWindowStageCreate');
        windowStage.loadContent('pages/BillHomePage', (err) => {
            if (err.code) {
                hilog.error(0x0000, 'EntryAbility', `Failed to load the content. Code:${err.code},message: ${err.message}`);
                return;
            }
            hilog.info(0x0000, 'EntryAbility', 'Succeeded in loading the content.');
            try {
                AppStorage.setOrCreate('uiContext', windowStage.getMainWindowSync().getUIContext());
            }
            catch (err) {
                hilog.error(0x0000, 'EntryAbility', `getMainWindowSync failed. Code:${err.code},message: ${err.message}`);
            }
        });
    }
    onWindowStageDestroy(): void {
        // Main window is destroyed, release UI related resources.
        hilog.isLoggable(0x0000, 'EntryAbility', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        // Ability has brought to foreground.
        hilog.isLoggable(0x0000, 'EntryAbility', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onForeground');
    }
    onBackground(): void {
        // Ability has back to background.
        hilog.isLoggable(0x0000, 'EntryAbility', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onBackground');
    }
    /**
     * Apply for the permission to exchange data between different devices.
     */
    permissions(): void {
        let atManager = abilityAccessCtrl.createAtManager();
        atManager.requestPermissionsFromUser(this.context, ['ohos.permission.DISTRIBUTED_DATASYNC']).then((data) => {
            hilog.info(0x0000, 'EntryAbility', `Data permissions:${data.permissions}`);
        }).catch((err: BusinessError) => {
            hilog.error(0x0000, 'EntryAbility', `request permissions failed, Code:${err.code},message: ${err.message}`);
        });
    }
}
