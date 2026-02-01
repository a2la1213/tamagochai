// src/hooks/useSensors.ts
// Hook pour accéder aux capteurs du smartphone

import { useCallback, useEffect, useState, useMemo } from 'react';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import { useTamagochaiStore } from '../stores';
import { hormoneService } from '../services/core';
import { SensorContext, BatteryState, NetworkState, TimeContext } from '../types';
import { HORMONE_MODIFIERS } from '../constants';
import { formatBattery, formatPartOfDay, formatGreeting } from '../utils';

export function useSensors() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const refreshHormones = useTamagochaiStore(state => state.refreshHormones);

  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 100,
    isCharging: false,
    isLow: false,
    isCritical: false,
  });

  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    type: 'wifi',
    isInternetReachable: true,
  });

  const [lastBatteryReaction, setLastBatteryReaction] = useState<Date | null>(null);

  const timeContext = useMemo((): TimeContext => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let partOfDay: 'night' | 'morning' | 'afternoon' | 'evening';
    if (hour >= 6 && hour < 12) {
      partOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
      partOfDay = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      partOfDay = 'evening';
    } else {
      partOfDay = 'night';
    }

    return {
      hour,
      minute,
      dayOfWeek,
      isWeekend,
      partOfDay,
      isNight: hour >= 22 || hour < 6,
    };
  }, []);

  const loadBatteryState = useCallback(async () => {
    try {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();

      const levelPercent = Math.round(level * 100);
      const isCharging = state === Battery.BatteryState.CHARGING;
      const isLow = levelPercent < 20;
      const isCritical = levelPercent < 10;

      setBatteryState({
        level: levelPercent,
        isCharging,
        isLow,
        isCritical,
      });

      return { levelPercent, isCharging, isLow, isCritical };
    } catch (error) {
      console.error('[useSensors] loadBatteryState error:', error);
      return null;
    }
  }, []);

  const loadNetworkState = useCallback(async () => {
    try {
      const state = await Network.getNetworkStateAsync();

      setNetworkState({
        isConnected: state.isConnected ?? false,
        type: state.type === Network.NetworkStateType.WIFI ? 'wifi' : 
              state.type === Network.NetworkStateType.CELLULAR ? 'cellular' : 'none',
        isInternetReachable: state.isInternetReachable ?? false,
      });
    } catch (error) {
      console.error('[useSensors] loadNetworkState error:', error);
    }
  }, []);

  const reactToBattery = useCallback(async () => {
    if (!tamagochai) return;

    if (lastBatteryReaction) {
      const elapsed = Date.now() - lastBatteryReaction.getTime();
      if (elapsed < 5 * 60 * 1000) return;
    }

    const battery = await loadBatteryState();
    if (!battery) return;

    try {
      if (battery.isCritical) {
        await hormoneService.applyPredefinedModifier(tamagochai.id, 'batteryCritical');
        setLastBatteryReaction(new Date());
      } else if (battery.isLow) {
        await hormoneService.applyPredefinedModifier(tamagochai.id, 'batteryLow');
        setLastBatteryReaction(new Date());
      } else if (battery.isCharging && battery.levelPercent < 50) {
        await hormoneService.applyPredefinedModifier(tamagochai.id, 'batteryCharging');
        setLastBatteryReaction(new Date());
      }

      await refreshHormones();
    } catch (error) {
      console.error('[useSensors] reactToBattery error:', error);
    }
  }, [tamagochai?.id, lastBatteryReaction, loadBatteryState, refreshHormones]);

  useEffect(() => {
    loadBatteryState();
    loadNetworkState();
  }, [loadBatteryState, loadNetworkState]);

  useEffect(() => {
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }: { batteryLevel: number }) => {
      const levelPercent = Math.round(batteryLevel * 100);
      setBatteryState((prev: BatteryState) => ({
        ...prev,
        level: levelPercent,
        isLow: levelPercent < 20,
        isCritical: levelPercent < 10,
      }));
    });

    const stateSubscription = Battery.addBatteryStateListener(({ batteryState }: { batteryState: Battery.BatteryState }) => {
      setBatteryState((prev: BatteryState) => ({
        ...prev,
        isCharging: batteryState === Battery.BatteryState.CHARGING,
      }));
    });

    return () => {
      subscription.remove();
      stateSubscription.remove();
    };
  }, []);

  const sensorContext = useMemo((): SensorContext => ({
    battery: batteryState,
    network: networkState,
    time: timeContext,
    lastUpdate: new Date(),
  }), [batteryState, networkState, timeContext]);

  const formattedBattery = useMemo(() => {
    return formatBattery(batteryState.level);
  }, [batteryState.level]);

  const greeting = useMemo(() => {
    return formatGreeting(timeContext.hour);
  }, [timeContext.hour]);

  const partOfDayFormatted = useMemo(() => {
    return formatPartOfDay(timeContext.hour);
  }, [timeContext.hour]);

  const getContextualMessage = useCallback((): string | null => {
    if (batteryState.isCritical) {
      return "Ma batterie est presque vide... Je vais bientôt m'éteindre !";
    }
    if (batteryState.isLow) {
      return "Ma batterie est faible... Tu peux me recharger ?";
    }
    if (batteryState.isCharging) {
      return "Merci de me recharger ! Je me sens mieux.";
    }
    if (timeContext.isNight) {
      return "Il est tard... Tu devrais peut-être dormir ?";
    }
    if (!networkState.isConnected) {
      return "Je n'ai pas de connexion... Je me sens un peu isolé.";
    }
    return null;
  }, [batteryState, timeContext, networkState]);

  return {
    battery: batteryState,
    network: networkState,
    time: timeContext,
    context: sensorContext,
    formattedBattery,
    greeting,
    partOfDay: partOfDayFormatted,
    refreshBattery: loadBatteryState,
    refreshNetwork: loadNetworkState,
    reactToBattery,
    getContextualMessage,
    isLowBattery: batteryState.isLow,
    isCriticalBattery: batteryState.isCritical,
    isCharging: batteryState.isCharging,
    isConnected: networkState.isConnected,
    isNight: timeContext.isNight,
    isWeekend: timeContext.isWeekend,
  };
}

export default useSensors;
