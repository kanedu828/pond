import IdleAnimation from '../assets/FishingAnimations/idle.gif';
import AppearAnimation from '../assets/FishingAnimations/appear.gif';
import CatchAnimation from '../assets/FishingAnimations/catch.gif';
import IdleWithFishAnimation from '../assets/FishingAnimations/idle_with_fish.gif';
import { Image } from '@mantine/core';
import { FishingAnimationState } from '../types/types';

interface AnimationManagerProps {
    state: FishingAnimationState;
    onClick: any;
}

export const AnimationManager = (props: AnimationManagerProps) => {

    function getCurrentAnimation(state: FishingAnimationState) {
        if (state === FishingAnimationState.Idle) {
            return IdleAnimation;
        } else if (state === FishingAnimationState.Catch) {
            return CatchAnimation;
        } else if (state === FishingAnimationState.IdleWithFish) {
            return IdleWithFishAnimation;
        } else if (state === FishingAnimationState.Appearing) {
            return AppearAnimation;
        }
    }

    return (
        <>
            <Image onClick={props.onClick} src={getCurrentAnimation(props.state)}/>
        </>
    );

}