package com.aitasker.repository;

import com.aitasker.entity.ServiceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceListingRepository extends JpaRepository<ServiceListing, Long> {
    List<ServiceListing> findByExpertId(Long expertId);
    List<ServiceListing> findByCategory(String category);
}
