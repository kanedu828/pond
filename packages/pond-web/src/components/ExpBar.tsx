import { Container, MantineStyleProp, Title, Text } from "@mantine/core";
import { expToLevel, percentToNextLevel } from "../util/exp";

interface ExpBarProps {
    exp: number;
    name: string;
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
    backgroundColor: '#85BED8',
    margin: '0',
    padding: '0',
}

export const ExpBar = (props: ExpBarProps) => {

    const level = expToLevel(props.exp);
    const percentValueToNextLevel = percentToNextLevel(props.exp);
   
  return (
        <Container style={{paddingTop: '5em'}}>
            <Title order={4} c='pondTeal.9'>{props.name}</Title>
            <Title order={5} c='pondTeal.9'>Level {level}</Title>
            <Container fluid style={expBarContainerStyle}>
                <Container style={{...expBarFillerStyle, width: `${percentValueToNextLevel}%`}}>
                    <Text color='white' size='sm'>{Math.round((percentValueToNextLevel + Number.EPSILON) * 100) / 100}%</Text>
                </Container>
            </Container>
        </Container>
        
    )
    
}