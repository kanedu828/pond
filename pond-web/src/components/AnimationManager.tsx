import IdleAnimation from '../assets/FishingAnimations/idle.gif';
import AppearAnimation from '../assets/FishingAnimations/appear.gif';
import CatchAnimation from '../assets/FishingAnimations/catch.gif';
import IdleWithFishAnimation from '../assets/FishingAnimations/idle_with_fish.gif';
import { Image } from '@mantine/core';
import { FishingAnimationState } from '../types/types';

interface AnimationManagerProps {
    state: FishingAnimationState;
    setState: any;
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

    function onClick() {
        const FISH_APPEARING_ANIMATION_MS = 800;
        const FISH_CATCH_ANIMATION_MS = 1600;
        if (props.state === FishingAnimationState.Idle) {
            props.setState(FishingAnimationState.Appearing);
            setTimeout(() => props.setState(FishingAnimationState.IdleWithFish), FISH_APPEARING_ANIMATION_MS);
        } else if (props.state === FishingAnimationState.IdleWithFish) {
            props.setState(FishingAnimationState.Catch);
            setTimeout(() => props.setState(FishingAnimationState.Idle), FISH_CATCH_ANIMATION_MS);
        }
    }

    return (
        <>
            <Image onClick={onClick} src={getCurrentAnimation(props.state)}/>
        </>
    );

}