import { NextResponse } from 'next/server';
import { fetchSerpApiJobs, fetchPublicJobsFallback } from '../../../lib/jobProviders.js';

const mockJobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'Tech Innovations Inc',
    location: 'San Francisco, CA',
    jobType: 'Hybrid',
    salaryRange: { min: 120, max: 160 },
    workingHours: '9 AM - 5 PM',
    description:
      'We are looking for an experienced React developer to lead our frontend team. You will work on cutting-edge applications serving millions of users.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    preferredSkills: ['Next.js', 'Tailwind CSS', 'Docker'],
    experience: '4+ years',
    postedDate: '2026-04-01',
    deadline: '2026-05-19',
    companyReviews: {
      overallRating: 4.5,
      cultureRating: 4.3,
      workLifeBalance: 4.2,
      compensationRating: 4.6,
      reviewCount: 324,
    },
    workingConditions: 'Modern office with gym, cafeteria, and learning budget',
    benefits: [
      'Health Insurance',
      '401(k) Match',
      'Learning Budget',
      'Flexible Hours',
      'Remote Work Options',
    ],
  },
  {
    id: '2',
    title: 'Junior Full-Stack Developer',
    company: 'StartupHub',
    location: 'Remote',
    jobType: 'WFH',
    stipend: 50000,
    workingHours: 'Flexible',
    description:
      'Join our fast-growing startup as a Junior Full-Stack Developer. Work on real projects and grow your skills.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    experience: '1-2 years',
    postedDate: '2026-04-10',
    deadline: '2026-04-30',
    companyReviews: {
      overallRating: 4.1,
      cultureRating: 4.4,
      workLifeBalance: 4.0,
      compensationRating: 3.8,
      reviewCount: 89,
    },
    workingConditions: 'Fast-paced startup environment with growth opportunities',
    benefits: ['Health Insurance', 'Stock Options', 'Professional Development'],
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'New York, NY',
    jobType: 'WFO',
    salaryRange: { min: 110, max: 150 },
    workingHours: '8 AM - 4 PM',
    description:
      'Manage and optimize our cloud infrastructure. Work with AWS, Kubernetes, and CI/CD pipelines.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Bash'],
    preferredSkills: ['Terraform', 'Jenkins', 'GitLab CI'],
    experience: '3+ years',
    postedDate: '2026-04-05',
    deadline: '2026-05-05',
    companyReviews: {
      overallRating: 4.3,
      cultureRating: 4.1,
      workLifeBalance: 3.9,
      compensationRating: 4.4,
      reviewCount: 156,
    },
    workingConditions: 'Enterprise environment with modern tools and practices',
    benefits: ['Health Insurance', 'Pension', 'Relocation Assistance', 'Training'],
  },
];

export async function GET(request) {
  try {
    const serpApiKey = (process.env.SERPAPI_KEY || '').trim();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') || 60)));

    const serpJobs = await fetchSerpApiJobs({ query, type, limit });
    const publicJobs = serpJobs.length === 0 ? await fetchPublicJobsFallback({ query, type, limit }) : [];

    let filtered = serpJobs.length > 0 ? serpJobs : publicJobs.length > 0 ? publicJobs : mockJobs;
    let source = serpJobs.length > 0 ? 'serpapi' : publicJobs.length > 0 ? 'public-fallback' : 'mock';

    if (query) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    if (type) {
      filtered = filtered.filter((job) => job.jobType === type);
    }

    return NextResponse.json({
      jobs: filtered.slice(0, limit),
      source,
      meta: {
        total: filtered.length,
        limit,
        serpConfigured: Boolean(serpApiKey),
      },
    });
  } catch (error) {
    console.error('Fetch jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json(
      { message: 'Job created successfully', job: body },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
