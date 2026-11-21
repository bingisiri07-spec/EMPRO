import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { SalaryBreakdown } from '../types';
import { MOCK_SALARY_DATA } from '../data/mockData';

export const salaryService = {
  /**
   * Fetches payslips and salary breakdown
   */
  async getSalaryHistory(memberId?: string): Promise<SalaryBreakdown[]> {
    if (!isSupabaseConfigured() || !memberId) {
      return [MOCK_SALARY_DATA];
    }

    const { data, error } = await supabase
      .from('payslips')
      .select('*')
      .eq('member_id', memberId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error || !data || data.length === 0) {
      return [MOCK_SALARY_DATA];
    }

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return data.map((slip: any) => ({
      month: monthNames[slip.month] || 'Month',
      year: slip.year,
      grossSalary: Number(slip.gross_pay) || 0,
      netSalary: Number(slip.net_pay) || 0,
      basicPay: Number(slip.basic_salary) || 0,
      hra: Number(slip.hra) || 0,
      specialAllowance: Number(slip.allowances) || 0,
      performanceBonus: 0,
      providentFund: Number(slip.pf_deduction) || 0,
      professionalTax: 200,
      incomeTaxTds: Number(slip.tax_deduction) || 0,
      otherDeductions: Number(slip.other_deductions) || 0,
      payoutDate: slip.issue_date,
      status: (slip.status === 'paid' ? 'Paid' : 'Processing') as SalaryBreakdown['status'],
      pdfFilename: `Payslip_${monthNames[slip.month]}_${slip.year}.pdf`,
    }));
  },
};
