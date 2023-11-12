import { Container, MantineStyleProp, Title, Text } from "@mantine/core";
import { expToLevel, percentToNextLevel } from "../util/exp";

interface ExpBarProps {
    exp: number;
}

const expBarContainerStyle: MantineStyleProp = {
    backgroundColor: '#f3f3f3',
    borderRadius: '50px',
    padding: '0'
}

const expBarFillerStyle: MantineStyleProp = {
    height: '100%',
    borderTopLeftRadius: 'inherit',
    borderBottomLeftRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s ease-in-out',
    backgroundColor: '#66b4e9',
    margin: '0',
    padding: '0',
}

export const ExpBar = (props: ExpBarProps) => {

    const level = expToLevel(props.exp);
    const percentValueToNextLevel = percentToNextLevel(props.exp);
   
  return (
        <Container style={{paddingTop: '5em'}}>
            <Title order={2}>Level {level}</Title>
            <Container fluid style={expBarContainerStyle}>
                <Container style={{...expBarFillerStyle, width: `${percentValueToNextLevel}%`}}>
                    <Text size='sm'>{Math.round((percentValueToNextLevel + Number.EPSILON) * 100) / 100}%</Text>
                </Container>
            </Container>
        </Container>
        
    )
    
}