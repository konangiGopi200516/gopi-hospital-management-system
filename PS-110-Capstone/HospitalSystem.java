import java.io.*;
import java.util.*;

// --- CUSTOM EXCEPTIONS ---
class InvalidTransitionException extends Exception {
    public InvalidTransitionException(String message) {
        super(message);
    }
}

// --- MODELS (OOP, Encapsulation) ---
abstract class Person implements Serializable {
    private String id;
    private String name;

    public Person(String id, String name) {
        this.id = id;
        this.name = name;
    }
    public String getId() { return id; }
    public String getName() { return name; }
    
    @Override
    public String toString() { return name + " (ID: " + id + ")"; }
}

class Patient extends Person {
    private int age;
    private String ailment;

    public Patient(String id, String name, int age, String ailment) {
        super(id, name);
        this.age = age;
        this.ailment = ailment;
    }
    public int getAge() { return age; }
    public String getAilment() { return ailment; }
    
    @Override
    public String toString() { return super.toString() + " - " + age + "yrs, Ailment: " + ailment; }
}

class Staff extends Person {
    private String role;

    public Staff(String id, String name, String role) {
        super(id, name);
        this.role = role;
    }
    public String getRole() { return role; }
    
    @Override
    public String toString() { return super.toString() + " - Role: " + role; }
}

class Ward implements Serializable {
    private String wardId;
    private String wardName;
    private int capacity;
    private int occupiedBeds;

    public Ward(String wardId, String wardName, int capacity) {
        this.wardId = wardId;
        this.wardName = wardName;
        this.capacity = capacity;
        this.occupiedBeds = 0;
    }
    
    public String getWardId() { return wardId; }
    public String getWardName() { return wardName; }
    public int getAvailableBeds() { return capacity - occupiedBeds; }
    
    // Valid state transitions for bed occupancy
    public void admitPatient() throws InvalidTransitionException {
        if (occupiedBeds >= capacity) {
            throw new InvalidTransitionException("Ward '" + wardName + "' is fully occupied! Cannot admit patient.");
        }
        occupiedBeds++;
    }
    
    public void dischargePatient() throws InvalidTransitionException {
        if (occupiedBeds <= 0) {
            throw new InvalidTransitionException("Ward '" + wardName + "' has no patients to discharge!");
        }
        occupiedBeds--;
    }
    
    @Override
    public String toString() {
        return wardName + " (ID: " + wardId + ") - Occupancy: " + occupiedBeds + "/" + capacity;
    }
}

class Admission implements Serializable {
    private String admissionId;
    private Patient patient;
    private Ward ward;
    private String status; // "ADMITTED" or "DISCHARGED"
    private Date admissionDate;
    
    public Admission(String admissionId, Patient patient, Ward ward) {
        this.admissionId = admissionId;
        this.patient = patient;
        this.ward = ward;
        this.status = "ADMITTED";
        this.admissionDate = new Date();
    }

    public String getAdmissionId() { return admissionId; }
    public String getStatus() { return status; }
    public Patient getPatient() { return patient; }
    public Ward getWard() { return ward; }
    
    public void markAsDischarged() throws InvalidTransitionException {
        if ("DISCHARGED".equals(status)) {
            throw new InvalidTransitionException("Patient is already discharged!");
        }
        status = "DISCHARGED";
    }

    @Override
    public String toString() {
        return "Admission[" + admissionId + "] " + patient.getName() + " -> " + ward.getWardName() + " | Status: " + status;
    }
}

// --- MAIN SYSTEM LOOP & PERSISTENCE ---
public class HospitalSystem {
    private static final String DATA_FILE = "hospital_database.ser";
    
    // Collections
    private Map<String, Patient> patients = new HashMap<>();
    private Map<String, Staff> staffMembers = new HashMap<>();
    private Map<String, Ward> wards = new HashMap<>();
    private Map<String, Admission> admissions = new HashMap<>();
    
    public HospitalSystem() {
        // Initialize default wards
        wards.put("W1", new Ward("W1", "General Ward", 20));
        wards.put("W2", new Ward("W2", "Intensive Care Unit (ICU)", 5));
        wards.put("W3", new Ward("W3", "Pediatrics", 10));
    }
    
    public void registerPatient(String id, String name, int age, String ailment) {
        if (patients.containsKey(id)) {
            System.out.println("Error: Patient ID already exists.");
            return;
        }
        patients.put(id, new Patient(id, name, age, ailment));
        System.out.println("Success: Patient registered.");
    }
    
    public void addStaff(String id, String name, String role) {
        if (staffMembers.containsKey(id)) {
            System.out.println("Error: Staff ID already exists.");
            return;
        }
        staffMembers.put(id, new Staff(id, name, role));
        System.out.println("Success: Staff member added.");
    }
    
    public void admitPatient(String admissionId, String patientId, String wardId) {
        try {
            if (!patients.containsKey(patientId)) throw new InvalidTransitionException("Patient not found.");
            if (!wards.containsKey(wardId)) throw new InvalidTransitionException("Ward not found.");
            if (admissions.containsKey(admissionId)) throw new InvalidTransitionException("Admission ID already exists.");
            
            Patient p = patients.get(patientId);
            Ward w = wards.get(wardId);
            
            // This enforces occupancy rules
            w.admitPatient(); 
            
            Admission adm = new Admission(admissionId, p, w);
            admissions.put(admissionId, adm);
            System.out.println("Success: Patient admitted to " + w.getWardName());
        } catch (InvalidTransitionException e) {
            System.out.println("Admission Failed: " + e.getMessage());
        }
    }
    
    public void dischargePatient(String admissionId) {
        try {
            if (!admissions.containsKey(admissionId)) throw new InvalidTransitionException("Admission record not found.");
            
            Admission adm = admissions.get(admissionId);
            
            // Enforce valid state transitions
            adm.markAsDischarged(); 
            adm.getWard().dischargePatient(); 
            
            System.out.println("Success: Patient discharged successfully.");
        } catch (InvalidTransitionException e) {
            System.out.println("Discharge Failed: " + e.getMessage());
        }
    }
    
    public void viewOccupancy() {
        System.out.println("\n--- Current Bed Occupancy ---");
        for (Ward w : wards.values()) {
            System.out.println(w.toString());
        }
    }
    
    public void viewAllAdmissions() {
        System.out.println("\n--- Admission Records ---");
        if (admissions.isEmpty()) {
            System.out.println("No records found.");
        }
        for (Admission a : admissions.values()) {
            System.out.println(a.toString());
        }
    }

    // --- FILE I/O (Persistence) ---
    public void saveData() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(DATA_FILE))) {
            oos.writeObject(patients);
            oos.writeObject(staffMembers);
            oos.writeObject(wards);
            oos.writeObject(admissions);
            System.out.println("Success: Database persisted to file.");
        } catch (IOException e) {
            System.out.println("Error saving data: " + e.getMessage());
        }
    }
    
    @SuppressWarnings("unchecked")
    public void loadData() {
        File file = new File(DATA_FILE);
        if (!file.exists()) return; // First time run
        
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(DATA_FILE))) {
            patients = (Map<String, Patient>) ois.readObject();
            staffMembers = (Map<String, Staff>) ois.readObject();
            wards = (Map<String, Ward>) ois.readObject();
            admissions = (Map<String, Admission>) ois.readObject();
            System.out.println("Success: Database reloaded from file.");
        } catch (IOException | ClassNotFoundException e) {
            System.out.println("Error loading data: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        HospitalSystem system = new HospitalSystem();
        system.loadData();
        Scanner scanner = new Scanner(System.in);
        
        while (true) {
            System.out.println("\n=== PS-110 Hospital Management System ===");
            System.out.println("1. Register New Patient");
            System.out.println("2. Add Staff Member");
            System.out.println("3. Admit Patient");
            System.out.println("4. Discharge Patient");
            System.out.println("5. View Bed Occupancy");
            System.out.println("6. View Admission Records");
            System.out.println("7. Save Data & Exit");
            System.out.print("Select operation (1-7): ");
            
            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    System.out.print("Enter Patient ID: "); String pId = scanner.nextLine();
                    System.out.print("Enter Name: "); String pName = scanner.nextLine();
                    System.out.print("Enter Age: "); 
                    int pAge;
                    try { pAge = Integer.parseInt(scanner.nextLine()); } catch(Exception e) { System.out.println("Invalid age."); break; }
                    System.out.print("Enter Ailment: "); String ailment = scanner.nextLine();
                    system.registerPatient(pId, pName, pAge, ailment);
                    break;
                case "2":
                    System.out.print("Enter Staff ID: "); String sId = scanner.nextLine();
                    System.out.print("Enter Name: "); String sName = scanner.nextLine();
                    System.out.print("Enter Role (Doctor/Nurse): "); String role = scanner.nextLine();
                    system.addStaff(sId, sName, role);
                    break;
                case "3":
                    System.out.print("Enter New Admission ID: "); String aId = scanner.nextLine();
                    System.out.print("Enter Existing Patient ID: "); String admPId = scanner.nextLine();
                    System.out.print("Enter Ward ID (W1=General, W2=ICU, W3=Pediatrics): "); String admWId = scanner.nextLine();
                    system.admitPatient(aId, admPId, admWId);
                    break;
                case "4":
                    System.out.print("Enter Admission ID to Discharge: "); String dId = scanner.nextLine();
                    system.dischargePatient(dId);
                    break;
                case "5":
                    system.viewOccupancy();
                    break;
                case "6":
                    system.viewAllAdmissions();
                    break;
                case "7":
                    system.saveData();
                    System.out.println("System shutting down securely...");
                    return;
                default:
                    System.out.println("Invalid choice. Please enter a number from 1 to 7.");
            }
        }
    }
}
