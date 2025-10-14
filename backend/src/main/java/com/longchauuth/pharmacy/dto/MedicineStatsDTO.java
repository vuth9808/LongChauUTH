package com.longchauuth.pharmacy.dto;

public class MedicineStatsDTO {

    private Long activeMedicines;
    private Long expiredMedicines;
    private Long totalMedicines;

    // Constructors
    public MedicineStatsDTO() {
    }

    public MedicineStatsDTO(Long activeMedicines, Long expiredMedicines, Long totalMedicines) {
        this.activeMedicines = activeMedicines;
        this.expiredMedicines = expiredMedicines;
        this.totalMedicines = totalMedicines;
    }

    // Getters and Setters
    public Long getActiveMedicines() {
        return activeMedicines;
    }

    public void setActiveMedicines(Long activeMedicines) {
        this.activeMedicines = activeMedicines;
    }

    public Long getExpiredMedicines() {
        return expiredMedicines;
    }

    public void setExpiredMedicines(Long expiredMedicines) {
        this.expiredMedicines = expiredMedicines;
    }

    public Long getTotalMedicines() {
        return totalMedicines;
    }

    public void setTotalMedicines(Long totalMedicines) {
        this.totalMedicines = totalMedicines;
    }
}

