// Map postcodes to area names
const postcodeToAreaMap: Record<string, string> = {
  // Central London
  'WC1': 'Bloomsbury',
  'WC2': 'Holborn',
  'EC1': 'Clerkenwell',
  'EC2': 'City',
  'EC3': 'City',
  'EC4': 'City',
  
  // West London
  'W1': 'Marylebone',
  'W2': 'Paddington',
  'W3': 'Acton',
  'W4': 'Chiswick',
  'W5': 'Ealing',
  'W6': 'Hammersmith',
  'W7': 'Hanwell',
  'W8': 'Kensington',
  'W9': 'Maida Vale',
  'W10': 'North Kensington',
  'W11': 'Notting Hill',
  'W12': 'Shepherds Bush',
  'W13': 'West Ealing',
  'W14': 'West Kensington',
  
  // North London
  'N1': 'Islington',
  'N2': 'East Finchley',
  'N3': 'Finchley',
  'N4': 'Finsbury Park',
  'N5': 'Highbury',
  'N6': 'Highgate',
  'N7': 'Holloway',
  'N8': 'Hornsey',
  'N9': 'Lower Edmonton',
  'N10': 'Muswell Hill',
  'N11': 'New Southgate',
  'N12': 'North Finchley',
  'N13': 'Palmers Green',
  'N14': 'Southgate',
  'N15': 'Seven Sisters',
  'N16': 'Stoke Newington',
  'N17': 'Tottenham',
  'N18': 'Upper Edmonton',
  'N19': 'Archway',
  'N20': 'Whetstone',
  'N21': 'Winchmore Hill',
  'N22': 'Wood Green',
  
  // South London
  'SW1': 'Westminster',
  'SW2': 'Brixton',
  'SW3': 'Chelsea',
  'SW4': 'Clapham',
  'SW5': 'Earl\'s Court',
  'SW6': 'Fulham',
  'SW7': 'South Kensington',
  'SW8': 'South Lambeth',
  'SW9': 'Stockwell',
  'SW10': 'West Brompton',
  'SW11': 'Battersea',
  'SW12': 'Balham',
  'SW13': 'Barnes',
  'SW14': 'East Sheen',
  'SW15': 'Putney',
  'SW16': 'Streatham',
  'SW17': 'Tooting',
  'SW18': 'Wandsworth',
  'SW19': 'Wimbledon',
  'SW20': 'Raynes Park',
  
  // South East London
  'SE1': 'Southwark',
  'SE2': 'Abbey Wood',
  'SE3': 'Blackheath',
  'SE4': 'Brockley',
  'SE5': 'Camberwell',
  'SE6': 'Catford',
  'SE7': 'Charlton',
  'SE8': 'Deptford',
  'SE9': 'Eltham',
  'SE10': 'Greenwich',
  'SE11': 'Kennington',
  'SE12': 'Lee',
  'SE13': 'Lewisham',
  'SE14': 'New Cross',
  'SE15': 'Peckham',
  'SE16': 'Rotherhithe',
  'SE17': 'Walworth',
  'SE18': 'Woolwich',
  'SE19': 'Crystal Palace',
  'SE20': 'Penge',
  'SE21': 'Dulwich',
  'SE22': 'East Dulwich',
  'SE23': 'Forest Hill',
  'SE24': 'Herne Hill',
  'SE25': 'South Norwood',
  'SE26': 'Sydenham',
  'SE27': 'West Norwood',
  'SE28': 'Thamesmead',
  
  // East London
  'E1': 'Whitechapel',
  'E2': 'Bethnal Green',
  'E3': 'Bow',
  'E4': 'Chingford',
  'E5': 'Clapton',
  'E6': 'East Ham',
  'E7': 'Forest Gate',
  'E8': 'Hackney',
  'E9': 'Homerton',
  'E10': 'Leyton',
  'E11': 'Leytonstone',
  'E12': 'Manor Park',
  'E13': 'Plaistow',
  'E14': 'Canary Wharf',
  'E15': 'Stratford',
  'E16': 'Canning Town',
  'E17': 'Walthamstow',
  'E18': 'South Woodford',
  'E20': 'Olympic Park',
}

export const formatLocationDisplay = (location: string | null): string => {
  if (!location) return 'Location not specified'
  
  // Extract postcode pattern from location string
  const postcodeMatch = location.match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?)\b/i)
  if (postcodeMatch) {
    const postcodePrefix = postcodeMatch[1].toUpperCase()
    const areaName = postcodeToAreaMap[postcodePrefix]
    if (areaName) {
      return areaName
    }
  }
  
  // If no postcode match or no area mapping found, return original location
  return location
}