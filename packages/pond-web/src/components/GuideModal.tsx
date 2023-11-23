import { Modal, Stack, Title, Text, Image } from "@mantine/core";
import IdleAnimation from '../assets/FishingAnimations/idle.gif';
import IdleWithFishAnimation from '../assets/FishingAnimations/idle_with_fish.gif';

interface GuideModalProps {
    isOpen: any;
    close: any;
}

export const GuideModal = (props: GuideModalProps) => {
    return (
        <Modal
        opened={props.isOpen}
        onClose={props.close}
        radius={30}
        transitionProps={{ transition: 'fade', duration: 500 }}
        size='70%'
        centered
        >
            <Stack justify='space-between' align='center' style={{paddingBottom: '3%', paddingLeft: '20rem', paddingRight:'20rem'}}>
                <Title order={2} c='pondTeal.9'>Guide</Title>
                <Text size='xl' c='pondTeal.8'>
                    Welcome to Pond! Leave this site open while working, studying, gaming, or even lounging around.
                    Be sure to enable sound permissions so you can hear when a fish arrives!
                </Text>
                <Image w={'40em'} src={IdleAnimation}/>
                <Text size='xl' c='pondTeal.8'>
                    When you see this animation, you are waiting for a fish. Fish come every 10 to 60 minutes.
                    Be patient and stay on a lookout for incoming fish!
                </Text>
                <Image w={'40em'} src={IdleWithFishAnimation}/>
                <Text size='xl' c='pondTeal.8'>
                    When you see a fish bobbing, that means there is a fish! Click on the
                    screen to catch the fish. Be sure to be quick as the fish may get away. Rarer
                    fish may escape quickly!
                </Text>

            </Stack>
        </Modal>  
    );
};