// Define types for the exercises
export interface Exercise {
  id: string;
  time: string;
  name: string;
  description: string;
  image: string;
  sets?: string;
  reps?: string;
}

// Daily schedule of exercises based on the day of the week
export const WEEKLY_EXERCISE_SCHEDULE: { [key: string]: Exercise[] } = {
  // Monday: Pendlay Row + Overhead Squat
  "1": [
    { 
      id: 'mon-1', 
      time: '05:10', 
      name: 'Dead Bug', 
      description: 'Lie on back, keep back flat on floor, extend left arm and right leg, maintain core stability',
      sets: '2 sets',
      reps: '10 reps (alternating)',
      image: 'https://via.placeholder.com/150?text=Dead+Bug'
    },
    { 
      id: 'mon-2', 
      time: '05:15', 
      name: 'Single-leg Glute Bridge (Left)', 
      description: 'Left foot on floor, right leg raised, use left glute to lift pelvis',
      sets: '2 sets',
      reps: '12 reps',
      image: 'https://via.placeholder.com/150?text=Glute+Bridge'
    },
    { 
      id: 'mon-3', 
      time: '05:20', 
      name: 'Wall Angels', 
      description: 'Slide arms up and down along wall, avoid shrugging shoulders',
      sets: '2 sets',
      reps: '8 reps',
      image: 'https://via.placeholder.com/150?text=Wall+Angels'
    },
  ],
  
  // Tuesday: Deadlift + DB B-Stance RDL
  "2": [
    { 
      id: 'tue-1', 
      time: '05:10', 
      name: 'Single-leg RDL (Left)', 
      description: 'Balance on left leg, extend right leg back, maintain pelvic balance',
      sets: '2 sets',
      reps: '8 reps',
      image: 'https://via.placeholder.com/150?text=Single+Leg+RDL'
    },
    { 
      id: 'tue-2', 
      time: '05:15', 
      name: 'Clamshell (Left)', 
      description: 'Lie on left side, knees apart, feet together, strengthen left gluteus medius',
      sets: '2 sets',
      reps: '15 reps',
      image: 'https://via.placeholder.com/150?text=Clamshell'
    },
    { 
      id: 'tue-3', 
      time: '05:20', 
      name: 'Lunge Hip Stretch (Right)', 
      description: 'Right leg back, keep hip neutral, gently push forward to stretch right hip',
      sets: '1 set',
      reps: '1 minute',
      image: 'https://via.placeholder.com/150?text=Lunge+Hip+Stretch'
    },
  ],
  
  // Wednesday: Snatch
  "3": [
    { 
      id: 'wed-1', 
      time: '05:10', 
      name: 'Controlled Toe to Bar', 
      description: 'No swinging, slowly raise legs using abs, shoulders depressed',
      sets: '2 sets',
      reps: '3-5 reps',
      image: 'https://via.placeholder.com/150?text=Toe+to+Bar'
    },
    { 
      id: 'wed-2', 
      time: '05:15', 
      name: 'World\'s Greatest Stretch (Left leg forward)', 
      description: 'Left leg in lunge, left hand rotates up to open chest',
      sets: '1 set',
      reps: '1 minute',
      image: 'https://via.placeholder.com/150?text=Greatest+Stretch'
    },
    { 
      id: 'wed-3', 
      time: '05:20', 
      name: 'Side Plank (Left)', 
      description: 'Support on left elbow, neutral pelvis, feel left oblique activation',
      sets: '2 sets',
      reps: '30 seconds',
      image: 'https://via.placeholder.com/150?text=Side+Plank'
    },
  ],
  
  // Thursday: Back Squat + Front Squat
  "4": [
    { 
      id: 'thu-1', 
      time: '05:10', 
      name: 'Glute Bridge (Left)', 
      description: 'Same as Monday, optional extra set for activation',
      sets: '2 sets',
      reps: '12 reps',
      image: 'https://via.placeholder.com/150?text=Glute+Bridge'
    },
    { 
      id: 'thu-2', 
      time: '05:15', 
      name: 'Bulgarian Split Squat (Left leg forward)', 
      description: 'Left leg forward, keep pelvis level, focus on left glute control',
      sets: '2 sets',
      reps: '10 reps',
      image: 'https://via.placeholder.com/150?text=Bulgarian+Split+Squat'
    },
    { 
      id: 'thu-3', 
      time: '05:20', 
      name: 'Foam Rolling Left QL', 
      description: 'Roll left lower back muscles, deep breathe to release tension',
      sets: '1 set',
      reps: '1 minute',
      image: 'https://via.placeholder.com/150?text=Foam+Rolling'
    },
  ],
  
  // Friday: Push Press
  "5": [
    { 
      id: 'fri-1', 
      time: '05:10', 
      name: 'Upper Trap Stretch (Right)', 
      description: 'Seated, gently tilt head down and left with left hand, relax right shoulder',
      sets: '1 set',
      reps: '1 minute',
      image: 'https://via.placeholder.com/150?text=Upper+Trap+Stretch'
    },
    { 
      id: 'fri-2', 
      time: '05:15', 
      name: 'Dead Bug', 
      description: 'Same as Monday',
      sets: '2 sets',
      reps: '10 reps',
      image: 'https://via.placeholder.com/150?text=Dead+Bug'
    },
    { 
      id: 'fri-3', 
      time: '05:20', 
      name: 'Wall Angels', 
      description: 'Same as Monday',
      sets: '2 sets',
      reps: '8 reps',
      image: 'https://via.placeholder.com/150?text=Wall+Angels'
    },
  ],
  
  // Saturday: Active Recovery
  "6": [
    { 
      id: 'sat-1', 
      time: '05:10', 
      name: 'Diaphragmatic Breathing', 
      description: 'Deep breathing, expand abdomen, focus on diaphragm',
      sets: '1 set',
      reps: '2 minutes',
      image: 'https://via.placeholder.com/150?text=Breathing'
    },
    { 
      id: 'sat-2', 
      time: '05:15', 
      name: 'Cat-Cow', 
      description: 'Dynamic stretch, alternate arching and dropping spine',
      sets: '1 set',
      reps: '10 reps',
      image: 'https://via.placeholder.com/150?text=Cat+Cow'
    },
    { 
      id: 'sat-3', 
      time: '05:20', 
      name: 'Windshield Wiper', 
      description: 'Knees swing side to side, mobilize lower back and pelvis',
      sets: '1 set',
      reps: '10 reps each side',
      image: 'https://via.placeholder.com/150?text=Windshield+Wiper'
    },
  ],
  
  // Sunday: Self Check-in
  "0": [
    { 
      id: 'sun-1', 
      time: '05:10', 
      name: 'Foam Roll Right Hip', 
      description: 'Use foam roller on right hip area to relieve tension',
      sets: '1 set',
      reps: '1 minute',
      image: 'https://via.placeholder.com/150?text=Foam+Roll+Hip'
    },
    { 
      id: 'sun-2', 
      time: '05:15', 
      name: 'Foam Roll Left Lower Back', 
      description: 'Use foam roller on left lower back to relieve tension',
      sets: '1 set',
      reps: '1 minute',
      image: 'https://via.placeholder.com/150?text=Foam+Roll+Back'
    },
    { 
      id: 'sun-3', 
      time: '05:20', 
      name: 'Foam Roll Right Shoulder', 
      description: 'Use foam roller on right shoulder area to relieve tension',
      sets: '1 set',
      reps: '1 minute',
      image: 'https://via.placeholder.com/150?text=Foam+Roll+Shoulder'
    },
    { 
      id: 'sun-4', 
      time: '05:25', 
      name: 'Self-Assessment', 
      description: 'Observe: glute activation symmetry, shoulder level, lower back discomfort',
      sets: '1 set',
      reps: '5 minutes',
      image: 'https://via.placeholder.com/150?text=Self+Assessment'
    },
  ],
}; 